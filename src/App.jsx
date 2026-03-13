import React, { useState, useEffect, useRef } from "react";
import LoginView from "./components/views/LoginView";
import HomeView from "./components/views/HomeView";
import RoomView from "./components/views/RoomView";
import ModeView from "./components/views/ModeView";
import AdminView from "./components/views/AdminView";
import SharedView from "./components/views/SharedView";
import Tutorial from "./components/ui/Tutorial";

import { SYS, ML, AI_MODELS } from "./utils/constants";
import { callAI, getAvailableModels } from "./services/aiService";
import * as db from "./services/supabase";
import { getWorkingStyle, saveWorkingStyle, deleteWorkingStyle, getOrgOkr, saveOrgOkr, deleteOrgOkr, getOrgBp, saveOrgBp, deleteOrgBp } from "./services/supabase";

window.showToast = (msg, type = "info") => {
  window.dispatchEvent(new CustomEvent("show-toast", { detail: { msg, type } }));
};

const ToastContainer = () => {
  const [toasts, setToasts] = useState([]);
  useEffect(() => {
    const handler = e => {
      const id = Date.now() + Math.random();
      setToasts(p => [...p, { id, ...e.detail }]);
      setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3000);
    };
    window.addEventListener("show-toast", handler);
    return () => window.removeEventListener("show-toast", handler);
  }, []);
  return (
    <div style={{ position: "fixed", top: 20, left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", gap: 10, zIndex: 99999, alignItems: "center", pointerEvents: "none", width: "100%", maxWidth: 400 }}>
      <style>{`@keyframes fwToast{0%{transform:translateY(-20px);opacity:0}100%{transform:translateY(0);opacity:1}}`}</style>
      {toasts.map(t => (
        <div key={t.id} style={{ background: t.type === "error" ? "#EF4444" : "#1F2937", color: "#fff", padding: "12px 24px", borderRadius: 30, boxShadow: "0 10px 25px rgba(0,0,0,0.2)", fontSize: 13, fontWeight: 700, animation: "fwToast 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)", textAlign: "center", width: "max-content", maxWidth: "90%" }}>
          {t.type === "error" ? "⚠️" : "✅"} {t.msg}
        </div>
      ))}
    </div>
  );
}

function App() {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem("lalasweet_user");
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  });
  const [view, _setView] = useState(() => {
    const hash = window.location.hash.replace("#", "");
    if (hash.startsWith("access_token=") || hash.startsWith("error_description=")) return "home"; // Let Supabase handle auth hashes
    if (hash.startsWith("share-")) return "share";
    return hash || "home";
  });
  const [shareId, setShareId] = useState(() => {
    const hash = window.location.hash.replace("#", "");
    if (hash.startsWith("share-")) return hash.replace("share-", "");
    return null;
  });

  const setView = (v) => {
    _setView(v);
    if (v === "share" && shareId) {
      window.location.hash = `share-${shareId}`;
    } else {
      window.location.hash = v;
    }
  };

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "");
      if (hash.startsWith("access_token=") || hash.startsWith("error_description=")) return; // Ignore Supabase OAuth hashes
      if (hash.startsWith("share-")) {
        setShareId(hash.replace("share-", ""));
        _setView("share");
      } else {
        _setView(hash || "home");
      }
    };
    // Check hash manually on load in case localStorage is blocked completely (Comet Browser)
    const initialHash = window.location.hash.replace("#", "");
    console.log(`Hash detected: ${initialHash.substring(0, 50)}...`);
    if (initialHash.includes("access_token=")) {
      console.log("access_token found in hash, attempting manual session recovery");
      const hashParams = new URLSearchParams(initialHash);
      const accessToken = hashParams.get("access_token");
      const refreshToken = hashParams.get("refresh_token");
      console.log(`Token parsed: AT=${!!accessToken}, RT=${!!refreshToken}`);

      if (accessToken && refreshToken) {
        db.supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken
        }).then(async ({ data, error }) => {
          if (error) {
            console.log(`setSession ERROR: ${error.message}`);
          } else if (data?.session?.user) {
            console.log(`setSession OK: user=${data.session.user.email}`);
            const syncedUser = await db.syncGoogleUser(data.session.user);
            console.log(`syncGoogleUser result: ${syncedUser ? syncedUser.id : 'NULL'}`);
            if (syncedUser) {
              setUser(syncedUser);
              try { localStorage.setItem("lalasweet_user", JSON.stringify(syncedUser)); } catch(e){}
              window.location.hash = "home";
            }
          } else {
            console.log(`setSession: no session/user in response`);
          }
        }).catch(err => {
          console.log(`setSession CATCH: ${err.message}`);
        });
      }
    } else if (!initialHash && !window.location.search.includes("code=")) {
        window.location.hash = "home";
    }

    // Listen for Supabase Auth changes (Google Login callback ONLY)
    let googleLoginProcessed = false;
    const isOAuthRedirect = window.location.hash.includes('access_token=');
    console.log(`onAuthStateChange registered. isOAuth=${isOAuthRedirect}`);
    const authSub = db.supabase?.auth?.onAuthStateChange(async (event, session) => {
      console.log(`AUTH EVENT: ${event}, hasUser=${!!session?.user}, isOAuth=${isOAuthRedirect}, processed=${googleLoginProcessed}`);

      // Handle Google OAuth: process ANY event that has a valid session during OAuth redirect
      if (isOAuthRedirect && session?.user && !googleLoginProcessed) {
        googleLoginProcessed = true;
        console.log(`Processing OAuth from ${event}, email=${session.user.email}`);
        try {
          const syncedUser = await db.syncGoogleUser(session.user);
          console.log(`syncGoogleUser: ${syncedUser ? 'OK id=' + syncedUser.id : 'FAILED/NULL'}`);
          if (syncedUser) {
            setUser(syncedUser);
            try { localStorage.setItem("lalasweet_user", JSON.stringify(syncedUser)); } catch(e){}
            window.location.hash = "home";
          }
        } catch(err) {
          console.log(`syncGoogleUser ERROR: ${err.message}`);
        }
        return;
      }

      if (event === 'SIGNED_OUT') {
        window.__pushDebug('SIGNED_OUT handled');
        setUser(null);
        try { localStorage.removeItem("lalasweet_user"); } catch(e){}
      }
    });

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
      if (authSub?.data?.subscription) {
        authSub.data.subscription.unsubscribe();
      }
    }
  }, []);
  const [guide, setGuide] = useState(null);
  const [guideLoad, setGuideLoad] = useState(true);
  const [workingStyle, setWorkingStyle] = useState(null);
  const [orgOkr, setOrgOkr] = useState(null);
  const [orgBp, setOrgBp] = useState(null);
  const fileRef = useRef(null);
  const goalsPdfRef = useRef(null);
  const [err, setErr] = useState("");

  const [rooms, setRooms] = useState([]);
  const [roomsLoad, setRoomsLoad] = useState(true);
  const [curRoom, setCurRoom] = useState(null);

  const [modeId, setModeId] = useState(null);
  const [step, setStep] = useState(0);
  const [selectedModel, setSelectedModel] = useState("claude-opus-4-20250514");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [modTxt, setModTxt] = useState("");
  const [expandIdx, setExpandIdx] = useState(null);

  // Load draft from localStorage
  const initDraft = () => { try { const s = localStorage.getItem("lalasweet_draft"); return s ? JSON.parse(s) : null; } catch { return null; } };
  const draft = initDraft() || {};

  // Mode 1 states
  const [f1, setF1] = useState(draft.f1 || { team: "", period: "", name: "", level: "L1", role: "", expectation: "", preLevel: "N" });
  const [okr, setOkr] = useState(draft.okr || "");
  const [noOkr, setNoOkr] = useState(draft.noOkr || false);
  const [goals, setGoals] = useState(draft.goals || "");
  const [savedGoals, setSavedGoals] = useState(null);
  const [goalsChecked, setGoalsChecked] = useState(false);

  const [goalsMode, setGoalsMode] = useState(draft.goalsMode || "text"); // "text" | "pdf"
  const [goalsPdfName, setGoalsPdfName] = useState("");
  const [goalsPdfData, setGoalsPdfData] = useState("");

  const [hasExisting, setHasExisting] = useState(draft.hasExisting || false);
  const [existingInit, setExistingInit] = useState(draft.existingInit || "");

  // Other Modes
  const [f2, setF2] = useState(draft.f2 || { name: "", level: "L1", role: "", initiatives: "", concern: "" });
  const [f3, setF3] = useState(draft.f3 || { name: "", content: "" });
  const [f4, setF4] = useState(draft.f4 || { name: "", role: "", context: "" });

  useEffect(() => {
    localStorage.setItem("lalasweet_draft", JSON.stringify({ f1, okr, noOkr, goals, goalsMode, hasExisting, existingInit, f2, f3, f4 }));
  }, [f1, okr, noOkr, goals, goalsMode, hasExisting, existingInit, f2, f3, f4]);

  const [adminAuth, setAdminAuth] = useState(false);
  const [apw, setApw] = useState("");
  const [pwErr, setPwErr] = useState("");
  const [adminTab, setAdminTab] = useState("guide");
  const [logs, setLogs] = useState([]);
  const [logsLoad, setLogsLoad] = useState(false);
  const [logDetail, setLogDetail] = useState(null);
  const [logFilter, setLogFilter] = useState("all");

  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const g = await db.getLevelGuide();
        if (g) setGuide(g);
      } catch (e) {
        console.error("Guide Load Error", e);
      }
      try {
        const ws = await getWorkingStyle();
        if (ws) setWorkingStyle(ws);
      } catch (e) {
        console.error("WorkingStyle Load Error", e);
      }
      try {
        const okrs = await getOrgOkr();
        setOrgOkr(okrs);
      } catch (e) {
        console.error("OKR Load Error", e);
      }
      try {
        const bps = await getOrgBp();
        setOrgBp(bps);
      } catch (e) {
        console.error("BP Load Error", e);
      }
      setGuideLoad(false);
      await loadRooms();
    })();
  }, [user]);

  const loadRooms = async () => {
    setRoomsLoad(true);
    try {
      const arr = await db.getRooms(user?.id);
      setRooms(arr);
    } catch (e) {
      console.error("Load Rooms error", e);
    }
    setRoomsLoad(false);
  };

  const saveRoomFlow = async (roomData) => {
    try {
      const saved = await db.saveRoom({ ...roomData, updated_at: Date.now() }, user?.id);
      if (saved) {
        // optimistically update local state ensuring correct order
        setRooms(prev => {
          const idx = prev.findIndex(x => x.id === saved.id);
          // merge with existing histories to avoid losing them locally
          const currentRoom = idx >= 0 ? prev[idx] : { history: [] };
          const next = idx >= 0
            ? [...prev.slice(0, idx), { ...saved, history: currentRoom.history }, ...prev.slice(idx + 1)]
            : [{ ...saved, history: [] }, ...prev];
          return next.sort((a, b) => b.updated_at - a.updated_at);
        });
        setCurRoom(prev => prev && prev.id === saved.id ? { ...saved, history: prev.history || [] } : prev);
        return saved;
      }
    } catch (e) {
      console.error("Save Room error", e);
    }
  };

  const deleteRoomFlow = async (id) => {
    try {
      await db.deleteRoom(id);
      setRooms(prev => prev.filter(x => x.id !== id));
      if (curRoom?.id === id) { setCurRoom(null); setView("home"); }
    } catch (e) {
      console.error("Delete room error", e);
    }
  };

  const addHistoryFlow = async (room, entry) => {
    try {
      // Avoid inserting empty room
      const savedRoom = await saveRoomFlow(room);
      const savedHistory = await db.addRoomHistory(savedRoom.id, entry);

      const newHistory = [savedHistory, ...(savedRoom.history || [])];
      const updatedRoom = { ...savedRoom, history: newHistory };

      setCurRoom(updatedRoom);
      setRooms(prev => {
        const idx = prev.findIndex(x => x.id === updatedRoom.id);
        if (idx < 0) return [updatedRoom, ...prev];
        return [...prev.slice(0, idx), updatedRoom, ...prev.slice(idx + 1)];
      });
    } catch (e) {
      console.error("Add history error", e);
    }
  };

  const importSharedHistory = async (sharedData) => {
    if (!sharedData || !sharedData.rooms) return;

    // Check if room with same name exists for current user
    let targetRoom = rooms.find(r => r.name === sharedData.rooms.name);

    // If not, create a new one based on the shared room's metadata
    if (!targetRoom) {
      targetRoom = createRoom(
        sharedData.rooms.team || "",
        sharedData.rooms.name,
        sharedData.rooms.level || "L1",
        sharedData.rooms.role || ""
      );
    }

    const newEntry = {
      mode: sharedData.mode,
      modeLabel: sharedData.mode_label,
      result: sharedData.result,
      info: sharedData.info || {},
      ts: Date.now()
    };

    await addHistoryFlow(targetRoom, newEntry);

    // Auto-navigate to that room
    const latestRoom = rooms.find(r => r.name === targetRoom.name) || targetRoom; // Fallback 
    setCurRoom(latestRoom); // addHistoryFlow already updates curRoom and rooms state
    setShareId(null);
    setView("room");
    window.showToast("히스토리가 내 공간에 복사되었습니다.");
  };

  // Level Guide
  const saveGuideFlow = async (n, d) => {
    try {
      await db.saveLevelGuide(n, d);
      setGuide({ name: n, data: d });
      return true;
    } catch (e) {
      setErr(e.message);
      return false;
    }
  };

  const deleteGuideFlow = async () => {
    try {
      await db.deleteLevelGuide();
      setGuide(null);
    } catch (e) { }
  };

  const handleFile = null; // PDF upload removed, using text input now

  // Goals PDF
  const handleGoalsPdf = async e => {
    const f = e.target.files?.[0]; if (!f) return;
    if (f.type !== "application/pdf") return;
    if (f.size > 4 * 1024 * 1024) return;
    const rd = new FileReader();
    rd.onload = () => {
      setGoalsPdfData(rd.result.split(",")[1]);
      setGoalsPdfName(f.name);
    };
    rd.readAsDataURL(f);
    e.target.value = "";
  };

  const checkGoals = async t => {
    if (!t.trim()) return;
    try {
      const r = await db.getOrgGoals(t.trim(), user?.id);
      if (r) setSavedGoals(r); else setSavedGoals(null);
    } catch { setSavedGoals(null); }
    setGoalsChecked(true);
  };

  const doSaveOrgGoals = async (t, g) => {
    if (!t.trim() || !g.trim()) return;
    await db.saveOrgGoals(t.trim(), g, user?.id);
  };

  const saveLogFlow = async (mid, info, res) => {
    const ts = Date.now();
    try {
      await db.saveAgentLog({
        ts, mode: mid, mode_label: ML[mid],
        name: info.name || "-", team: info.team || "-",
        role: info.role || "-", level: info.level || "-",
        result: res.substring(0, 2000), date: new Date(ts).toISOString()
      }, user?.id, user?.username);
    } catch { }
  };

  const loadLogsFlow = async () => {
    setLogsLoad(true);
    try {
      const arr = await db.getAgentLogs();
      setLogs(arr);
    } catch { }
    setLogsLoad(false);
  };

  const clearLogsFlow = async () => {
    try {
      await db.clearAgentLogs();
      setLogs([]);
      setLogDetail(null);
    } catch { }
  };

  const saveWorkingStyleFlow = async (content) => {
    try {
      await saveWorkingStyle(content);
      setWorkingStyle({ content, updated_at: new Date().toISOString() });
      return true;
    } catch (e) {
      setErr(e.message);
      return false;
    }
  };

  const deleteWorkingStyleFlow = async () => {
    try {
      await deleteWorkingStyle();
      setWorkingStyle(null);
    } catch (e) { }
  };

  // OKR flow (single-blob)
  const saveOrgOkrFlow = async (content) => {
    try {
      await saveOrgOkr(content);
      const data = await getOrgOkr();
      setOrgOkr(data);
      return true;
    } catch (e) {
      console.error("Save OKR error", e);
      return false;
    }
  };

  const deleteOrgOkrFlow = async () => {
    try {
      await deleteOrgOkr();
      setOrgOkr(null);
    } catch (e) {
      console.error("Delete OKR error", e);
    }
  };

  // BP flow (single-blob)
  const saveOrgBpFlow = async (content) => {
    try {
      await saveOrgBp(content);
      const data = await getOrgBp();
      setOrgBp(data);
      return true;
    } catch (e) {
      console.error("Save BP error", e);
      return false;
    }
  };

  const deleteOrgBpFlow = async () => {
    try {
      await deleteOrgBp();
      setOrgBp(null);
    } catch (e) {
      console.error("Delete BP error", e);
    }
  };

  const callAPI = async (sys, txt, mid, info, additionalDocs = [], targetRoom = null) => {
    setLoading(true); setErr(""); setResult("");
    try {
      const docs = [];
      // Guide: text injection only (no PDF attachment)
      for (const d of additionalDocs) docs.push(d);

      const prefix = additionalDocs.length > 0 ? "첨부된 PDF는 조직목표 문서입니다.\n\n" : "";

      // Inject BP (Best Practice), OKR, Guide, and working style into system prompt
      let finalSys = sys;

      // BP(Best Practice) — 최우선 적용: 잘 만들어진 이니셔티브 사례
      if (orgBp?.content) {
        finalSys += "\n\n[⭐ BP(Best Practice) — 최우선 참고 사례]\n아래는 조직에서 선호하는 양식으로 잘 만들어진 이니셔티브 사례입니다. 이 양식과 구조를 최우선으로 확인하고 적용하여 이니셔티브를 생성하세요.\n\n" + orgBp.content;
      }

      // OKR 참고
      if (orgOkr?.content) {
        finalSys += "\n\n[조직 OKR]\n" + orgOkr.content;
      }

      // 레벨 가이드 (text)
      if (guide?.data) {
        finalSys += "\n\n[레벨 가이드]\n" + guide.data;
      }

      // 일하는 방식
      if (workingStyle?.content) {
        finalSys += "\n\n[일하는 방식 문서]\n" + workingStyle.content;
      }

      const resText = await callAI(selectedModel, finalSys, prefix + txt, docs);
      setResult(resText);
      saveLogFlow(mid, info, resText);

      const roomToSave = targetRoom || curRoom;
      if (roomToSave) addHistoryFlow(roomToSave, { mode: mid, modeLabel: ML[mid], result: resText, info });
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleModify = async (fb, spec = "100%") => {
    setLoading(true); setErr(""); const prev = result; setResult("");

    try {
      const docs = [];
      // Guide is text-based now, injected via system prompt in callAPI

      let specText = "";
      if (spec !== "100%") {
        specText = `\n\n[❗️ 구체화 수준 지시사항 ❗️]\n사용자가 재요청한 구체화(상세도) 수준은 **기본 대비 ${spec}**입니다.\n기존 출력 내용의 분량, 딥다이브 정도, 가이드의 상세함을 ${spec}에 맞게 대폭 조절(축소 또는 확장)하여 출력하세요.`;
      }

      const txt = `이전 이니셔티브:\n${prev}\n---\n[수정] ${fb}${specText}\n\n포맷 유지하며 수정 반영.`;

      const resText = await callAI(selectedModel, SYS[1], txt, docs);
      setResult(resText);
      if (curRoom) addHistoryFlow(curRoom, { mode: 1, modeLabel: "🔄 수정", result: resText });
    } catch (e) {
      setErr(e.message);
      setResult(prev);
    } finally {
      setLoading(false);
    }
  };

  const openRoom = (room) => { setCurRoom(room); setExpandIdx(null); setView("room"); };

  const pinInitiative = async (content) => {
    if (!curRoom) return;
    const updated = { ...curRoom, fixed_initiative: content };
    setCurRoom(updated);
    await saveRoomFlow(updated);
  };

  const unpinInitiative = async () => {
    if (!curRoom) return;
    const updated = { ...curRoom, fixed_initiative: null };
    setCurRoom(updated);
    await saveRoomFlow(updated);
  };

  const startMode = (mid, room) => {
    setModeId(mid); setStep(0); setResult(""); setErr(""); setLoading(false);
    setSavedGoals(null); setGoalsChecked(false); setModTxt("");
    setHasExisting(false); setExistingInit("");
    setGoalsMode("text"); setGoalsPdfName(""); setGoalsPdfData("");
    if (room) {
      const n = room.name, t = room.team, r = room.role || "", l = room.level || "L1";
      if (mid === 1) setF1(p => ({ ...p, team: t, name: n, level: l, role: r }));
      if (mid === 2) setF2(p => ({ ...p, name: n, level: l, role: r, initiatives: room.fixed_initiative || "" }));
      if (mid === 3) setF3(p => ({ ...p, name: n }));
      if (mid === 4) setF4(p => ({ ...p, name: n, role: r }));
    }
    setView("mode");
  };

  const goHome = () => { setView("home"); setModeId(null); setResult(""); setErr(""); };
  const goRoom = () => { setView("room"); setModeId(null); setResult(""); setErr(""); };

  const createRoom = (team, name, level, role) => {
    const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
    return { id, team, name, level, role, history: [], created_at: Date.now(), updated_at: Date.now() };
  };

  const applyDirect = async () => {
    const r = existingInit.trim();
    const info = { name: f1.name, team: f1.team, role: f1.role, level: f1.level, expectation: f1.expectation };
    if (!curRoom || curRoom.name !== f1.name) {
      const rm = createRoom(f1.team, f1.name, f1.level || "L1", f1.role || "");
      await addHistoryFlow(rm, { mode: 1, modeLabel: "📋 직접 입력", result: r, info });
    } else {
      await addHistoryFlow(curRoom, { mode: 1, modeLabel: "📋 직접 입력", result: r, info });
    }
    saveLogFlow(1, info, r);
    setResult(r); setStep(99);
  };

  const gen1 = async () => {
    const info = { name: f1.name, team: f1.team, role: f1.role, level: f1.level, expectation: f1.expectation };

    let targetRoom = curRoom;
    if (!curRoom || curRoom.name !== f1.name) {
      targetRoom = createRoom(f1.team, f1.name, f1.level, f1.role);
      setCurRoom(targetRoom);
    } else {
      targetRoom = { ...curRoom, team: f1.team, level: f1.level, role: f1.role };
      setCurRoom(targetRoom);
    }

    const existingCtx = hasExisting && existingInit.trim() ? `\n\n[기존 이니셔티브 — 이를 기반으로 디벨롭해주세요]\n${existingInit.trim()}` : "";
    const goalsCtx = goalsMode === "pdf" && goalsPdfData
      ? "[조직목표]\n첨부된 PDF 문서를 참조해주세요."
      : `[조직목표]\n${goals}`;

    const extraDocs = goalsMode === "pdf" && goalsPdfData
      ? [{ type: "document", source: { type: "base64", media_type: "application/pdf", data: goalsPdfData } }]
      : [];

    callAPI(SYS[1], `[구성원]\n조직:${f1.team} 주기:${f1.period} 성명:${f1.name} 레벨:${f1.level} 직무:${f1.role}\n기대:${f1.expectation} Pre-Level:${f1.preLevel}\n\n${noOkr ? "[개인OKR] 없음" : `[개인OKR]\n${okr}`}\n\n${goalsCtx}${existingCtx}\n\n${noOkr ? "개인OKR 미운영. 조직목표+기대사항 기반." : "각 이니셔티브가 개인OKR의 KR 달성에 기여하는지 명시."}`, 1, info, extraDocs, targetRoom);
  };

  const gen2 = () => {
    const info = { name: f2.name, role: f2.role, level: f2.level };
    let targetRoom = curRoom;
    if (!curRoom || curRoom.name !== f2.name) {
      targetRoom = createRoom("", f2.name, f2.level, f2.role);
      setCurRoom(targetRoom);
    }
    const fixedCtx = targetRoom?.fixed_initiative ? `\n[고정 이니셔티브 — 이 내용을 기반으로 아젠다를 생성하세요]\n${targetRoom.fixed_initiative}\n` : "";
    callAPI(SYS[2], `[구성원] ${f2.name} [레벨] ${f2.level} [직무] ${f2.role}\n[이니셔티브]\n${f2.initiatives}\n[리더고민]\n${f2.concern || "없음"}${fixedCtx}\n\n성과 1on1 아젠다 생성. 리더 고민 반영.`, 2, info, [], targetRoom);
  };

  const gen3 = () => {
    let targetRoom = curRoom;
    if (!curRoom || curRoom.name !== f3.name) {
      targetRoom = createRoom("", f3.name, "L1", "");
      setCurRoom(targetRoom);
    }
    const fixedCtx = targetRoom?.fixed_initiative ? `\n[고정 이니셔티브 — 이 내용을 참고하여 미팅 노트를 정리하세요]\n${targetRoom.fixed_initiative}\n` : "";
    callAPI(SYS[3], `[구성원] ${f3.name}\n[미팅내용]\n${f3.content}${fixedCtx}\n\n600자 이내 가치중심 요약.`, 3, { name: f3.name }, [], targetRoom);
  };

  const gen4 = () => {
    let targetRoom = curRoom;
    if (!curRoom || curRoom.name !== f4.name) {
      targetRoom = createRoom("", f4.name, "L1", f4.role);
      setCurRoom(targetRoom);
    }
    const fixedCtx = targetRoom?.fixed_initiative ? `\n[고정 이니셔티브 — 이 내용을 참고하여 라포 아젠다를 생성하세요]\n${targetRoom.fixed_initiative}\n` : "";
    callAPI(SYS[4], `[구성원] ${f4.name} (${f4.role})\n[맥락] ${f4.context || "없음"}${fixedCtx}\n\n라포 1on1 아젠다 생성.`, 4, { name: f4.name, role: f4.role }, [], targetRoom);
  };

  const goalsValid = goalsMode === "pdf" ? !!goalsPdfData : goals.trim().length > 10;

  const availableModels = AI_MODELS;

  const handleLogin = async (username, password) => {
    const result = await db.loginUser(username, password);
    if (result.success) {
      setUser(result.user);
    }
    return result;
  };

  const handleLogout = async () => {
    setUser(null);
    setView("home");
    setRooms([]);
    setCurRoom(null);
    setGuide(null);
    setGuideLoad(true);
    setAdminAuth(false);
    try { await db.supabase.auth.signOut(); } catch (e) { }
  };

  if (!user) {
    return <LoginView onLogin={handleLogin} />;
  }

  let content = null;

  if (view === "home") {
    content = <HomeView guideLoad={guideLoad} guide={guide} roomsLoad={roomsLoad} rooms={rooms} setCurRoom={setCurRoom} startMode={startMode} deleteRoom={deleteRoomFlow} setView={setView} user={user} onLogout={handleLogout} />;
  } else if (view === "share") {
    content = <SharedView shareId={shareId} goHome={goHome} importSharedHistory={importSharedHistory} />;
  } else if (view === "room") {
    if (curRoom) content = <RoomView curRoom={curRoom} goHome={goHome} startMode={startMode} unpinInitiative={unpinInitiative} />;
    else setTimeout(() => setView("home"), 0);
  } else if (view === "mode") {
    if (modeId) content = <ModeView
      modeId={modeId} curRoom={curRoom} rooms={rooms} step={step} setStep={setStep} loading={loading} err={err} result={result}
      modTxt={modTxt} setModTxt={setModTxt} handleModify={handleModify} startMode={startMode} goHome={goHome} goRoom={goRoom}
      guide={guide} orgOkr={orgOkr}
      f1={f1} setF1={setF1} hasExisting={hasExisting} setHasExisting={setHasExisting} existingInit={existingInit} setExistingInit={setExistingInit} applyDirect={applyDirect}
      noOkr={noOkr} setNoOkr={setNoOkr} okr={okr} setOkr={setOkr} checkGoals={checkGoals}
      goalsMode={goalsMode} setGoalsMode={setGoalsMode} goalsChecked={goalsChecked} savedGoals={savedGoals} goals={goals} setGoals={setGoals}
      goalsPdfData={goalsPdfData} goalsPdfName={goalsPdfName} setGoalsPdfData={setGoalsPdfData} setGoalsPdfName={setGoalsPdfName} goalsPdfRef={goalsPdfRef} handleGoalsPdf={handleGoalsPdf}
      saveOrgGoals={doSaveOrgGoals} gen1={gen1} goalsValid={goalsValid}
      f2={f2} setF2={setF2} gen2={gen2}
      f3={f3} setF3={setF3} gen3={gen3}
      f4={f4} setF4={setF4} gen4={gen4}
      pinInitiative={pinInitiative} unpinInitiative={unpinInitiative}
    />;
    else setTimeout(() => setView("home"), 0);
  } else if (view === "admin") {
    content = <AdminView
      adminAuth={adminAuth} setAdminAuth={setAdminAuth} apw={apw} setApw={setApw} pwErr={pwErr} setPwErr={setPwErr} loadLogs={loadLogsFlow}
      guide={guide} fileRef={fileRef} deleteGuide={deleteGuideFlow} handleFile={handleFile} err={err} saveGuide={saveGuideFlow}
      adminTab={adminTab} setAdminTab={setAdminTab} logsLoad={logsLoad} logs={logs} logDetail={logDetail} setLogDetail={setLogDetail}
      logFilter={logFilter} setLogFilter={setLogFilter} clearLogs={clearLogsFlow} goHome={goHome}
      user={user}
      workingStyle={workingStyle} saveWorkingStyle={saveWorkingStyleFlow} deleteWorkingStyle={deleteWorkingStyleFlow}
      orgOkr={orgOkr} saveOrgOkr={saveOrgOkrFlow} deleteOrgOkr={deleteOrgOkrFlow}
      orgBp={orgBp} saveOrgBp={saveOrgBpFlow} deleteOrgBp={deleteOrgBpFlow}
    />;
  }

  const currentModel = AI_MODELS.find(m => m.id === selectedModel);

  return (
    <>
      <div style={{ paddingBottom: 72 }}>
        {content}
      </div>
      <div style={{
        position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 9999,
        background: "linear-gradient(135deg, #1E40AF 0%, #2478FF 50%, #3B82F6 100%)",
        backdropFilter: "blur(12px)",
        borderTop: "2px solid #1E3A8A", padding: "12px 16px",
        display: "flex", alignItems: "center", justifyContent: "center", gap: 10
      }}>
        <span style={{ fontSize: 16 }}>{currentModel?.icon || "🧠"}</span>
        <select
          value={selectedModel}
          onChange={e => setSelectedModel(e.target.value)}
          style={{
            padding: "10px 14px", borderRadius: 10,
            border: "2px solid rgba(255,255,255,0.3)", background: "rgba(255,255,255,0.9)", color: "#1F2937",
            fontSize: 13, fontWeight: 700, outline: "none", cursor: "pointer",
            maxWidth: 300
          }}
        >
          {AI_MODELS.map(m => (
            <option key={m.id} value={m.id}>{m.icon} {m.label}</option>
          ))}
        </select>
        <span style={{ fontSize: 11, color: "rgba(255,255,255,0.8)", maxWidth: 180, lineHeight: 1.3, fontWeight: 500 }}>{currentModel?.desc || ""}</span>
      </div>
      <Tutorial view={view} />
      <ToastContainer />
    </>
  );
}

export default App;
