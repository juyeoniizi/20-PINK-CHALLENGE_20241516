/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Home, 
  ListTodo, 
  Users, 
  User as UserIcon, 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle2, 
  Share2,
  Bell,
  Settings,
  Plus,
  Heart,
  MessageCircle,
  LogOut,
  Trash2,
  ChevronRight,
  Smartphone,
  Send,
  X,
  Pencil,
  ArrowLeft,
  UserPlus
} from 'lucide-react';
import { Button } from '@/components/ui/button.tsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.tsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.tsx';
import { Checkbox } from '@/components/ui/checkbox.tsx';
import { Progress } from '@/components/ui/progress.tsx';
import { Badge } from '@/components/ui/badge.tsx';
import { INITIAL_ROUTINES, UNIVERSITY_RANKING, MOCK_FRIENDS, MOCK_FEED, MOCK_MESSAGES, Routine } from './constants.ts';
import { cn } from '@/lib/utils.ts';
import productImg from './assets/images/cosrx_eye_patch_1777446510546.png';

type View = 'home' | 'routine' | 'community' | 'profile';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentView, setCurrentView] = useState<View>('home');
  const [routines, setRoutines] = useState<Routine[]>(INITIAL_ROUTINES);
  const [timeLeft, setTimeLeft] = useState(20 * 60);
  const [isActive, setIsActive] = useState(false);
  const [completedRoutines, setCompletedRoutines] = useState<string[]>([]);
  const [isPinkMode, setIsPinkMode] = useState(false);
  const [showComplete, setShowComplete] = useState(false);

  // Interaction States
  const [posts, setPosts] = useState(MOCK_FEED.map(p => ({ ...p, likedByMe: false })));
  const [friends, setFriends] = useState(MOCK_FRIENDS);
  const [messages, setMessages] = useState(MOCK_MESSAGES);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [isCreatingPost, setIsCreatingPost] = useState(false);
  const [selectedFriendId, setSelectedFriendId] = useState<string | null>(null);
  const [isMessaging, setIsMessaging] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isAddFriendOpen, setIsAddFriendOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [nickname, setNickname] = useState('박준호 챌린저');
  const [isEditingNickname, setIsEditingNickname] = useState(false);

  // Input states
  const [newPostContent, setNewPostContent] = useState('');
  const [newCommentText, setNewCommentText] = useState('');
  const [newMessageText, setNewMessageText] = useState('');
  const [friendSearchQuery, setFriendSearchQuery] = useState('');

  // Refund logic
  const refundDays = 14; 
  const refundProgress = (refundDays / 30) * 100;

  // Timer logic
  useEffect(() => {
    let interval: number | null = null;
    if (isActive && timeLeft > 0) {
      interval = window.setInterval(() => setTimeLeft(p => p - 1), 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      setShowComplete(true);
      if (interval) window.clearInterval(interval);
    }
    return () => { if (interval) window.clearInterval(interval); };
  }, [isActive, timeLeft]);

  useEffect(() => {
    setIsPinkMode(isActive);
  }, [isActive]);

  const addRoutine = () => {
    const newRoutine: Routine = {
      id: Math.random().toString(36).substr(2, 9),
      title: '새로운 루틴',
      duration: 5,
      icon: 'Plus'
    };
    setRoutines([...routines, newRoutine]);
  };

  const removeRoutine = (id: string) => {
    setRoutines(routines.filter(r => r.id !== id));
    setCompletedRoutines(completedRoutines.filter(r => r !== id));
  };

  const [editingRoutineId, setEditingRoutineId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');

  const startEditing = (routine: Routine) => {
    setEditingRoutineId(routine.id);
    setEditingTitle(routine.title);
  };

  const saveRoutineEdit = () => {
    if (editingTitle.trim() && editingRoutineId) {
      setRoutines(routines.map(r => r.id === editingRoutineId ? { ...r, title: editingTitle } : r));
    }
    setEditingRoutineId(null);
  };

  const handleLike = (e: React.MouseEvent, postId: string) => {
    e.stopPropagation();
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        const isLiked = p.likedByMe;
        return {
          ...p,
          likedByMe: !isLiked,
          likes: isLiked ? p.likes - 1 : p.likes + 1
        };
      }
      return p;
    }));
  };

  const handleCreatePost = () => {
    if (!newPostContent.trim()) return;
    const newPost = {
      id: `p${Date.now()}`,
      user: nickname,
      content: newPostContent,
      time: '방금 전',
      likes: 0,
      likedByMe: false,
      comments: []
    };
    setPosts([newPost, ...posts]);
    setNewPostContent('');
    setIsCreatingPost(false);
  };

  const handleAddComment = (postId: string) => {
    if (!newCommentText.trim()) return;
    setPosts(prev => prev.map(p => p.id === postId ? {
      ...p,
      comments: [...p.comments, { id: `c${Date.now()}`, user: '나', text: newCommentText }]
    } : p));
    setNewCommentText('');
  };

  const handleSendMessage = (friendId: string) => {
    if (!newMessageText.trim()) return;
    const newMsg = { sender: 'me', text: newMessageText, time: '방금 전' };
    setMessages(prev => ({
      ...prev,
      [friendId]: [...(prev[friendId] || []), newMsg]
    }));
    setNewMessageText('');
  };

  const handleAddFriend = () => {
    if (!friendSearchQuery.trim()) return;
    const newFriend = {
      id: `f${Date.now()}`,
      name: friendSearchQuery,
      status: '새로운 친구',
      avatar: ['😊', '😎', '✨', '🙌', '🔥'][Math.floor(Math.random() * 5)]
    };
    setFriends([...friends, newFriend]);
    setFriendSearchQuery('');
    setIsAddFriendOpen(false);
  };

  const currentPost = posts.find(p => p.id === selectedPostId);
  const currentFriend = friends.find(f => f.id === selectedFriendId);

  if (!isLoggedIn) {
    return <PhoneFrame><LoginScreen onLogin={() => setIsLoggedIn(true)} /></PhoneFrame>;
  }

  return (
    <PhoneFrame isPinkMode={isPinkMode}>
      <div className="h-full flex flex-col relative overflow-hidden">
        {/* Header */}
        <header className={cn("p-6 flex justify-between items-center z-10 transition-colors", isPinkMode ? "text-white" : "text-gray-900")}>
          <div onClick={() => setCurrentView('home')} className="cursor-pointer">
            <h1 className="text-xs font-bold tracking-[0.2em] uppercase">20' PINK</h1>
            <p className="text-[10px] opacity-70">Make Your 20 Mins PINK</p>
          </div>
          <div className="flex gap-3">
            <Bell className="w-4 h-4 cursor-pointer hover:scale-110 transition-transform" onClick={() => setIsNotificationsOpen(true)} />
            <Settings className="w-4 h-4 cursor-pointer hover:scale-110 transition-transform" onClick={() => setIsSettingsOpen(true)} />
          </div>
        </header>

        {/* Views */}
        <main className="flex-1 px-5 pb-24 overflow-y-auto hide-scrollbar">
          <AnimatePresence mode="wait">
            {currentView === 'home' && (
              <motion.div key="home" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex flex-col items-center py-4 space-y-8">
                <div className="relative w-60 h-60 flex items-center justify-center">
                  <svg className="absolute w-full h-full -rotate-90">
                    <circle cx="120" cy="120" r="110" stroke={isPinkMode ? "rgba(255,255,255,0.2)" : "#F3F4F6"} strokeWidth="6" fill="none" />
                    <motion.circle cx="120" cy="120" r="110" stroke={isPinkMode ? "white" : "#FF6B9B"} strokeWidth="6" fill="none" strokeDasharray="691" initial={{ strokeDashoffset: 691 }} animate={{ strokeDashoffset: 691 - (691 * ((1200 - timeLeft) / 1200)) }} transition={{ duration: 0.5 }} />
                  </svg>
                  <div className="text-center">
                    <div className={cn("text-5xl font-light tracking-tighter", isPinkMode ? "text-white" : "text-gray-900")}>
                      {Math.floor(timeLeft / 60).toString().padStart(2, '0')}:{(timeLeft % 60).toString().padStart(2, '0')}
                    </div>
                    <div className={cn("text-[9px] mt-1 font-medium tracking-widest uppercase opacity-70", isPinkMode ? "text-white" : "text-gray-400")}>
                      {isActive ? "Peptide Absorbing..." : "Start Challenge"}
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button size="icon" variant="outline" className={cn("rounded-full bg-transparent shadow-sm", isPinkMode ? "border-white text-white" : "border-gray-100")} onClick={() => { setIsActive(false); setTimeLeft(20 * 60); }}>
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                  <Button size="lg" className={cn("rounded-full w-16 h-16 shadow-xl transition-transform active:scale-90", isPinkMode ? "bg-white text-pink-500 hover:bg-white" : "bg-pink-500 text-white")} onClick={() => setIsActive(!isActive)}>
                    {isActive ? <Pause /> : <Play className="ml-1" />}
                  </Button>
                  <Button size="icon" variant="outline" className={cn("rounded-full bg-transparent shadow-sm", isPinkMode ? "border-white text-white" : "border-gray-100")} onClick={() => setIsShareOpen(true)}>
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>

                <Card className={cn("w-full border-none shadow-sm rounded-3xl", isPinkMode ? "bg-white/10 text-white" : "bg-gray-50")}>
                  <CardContent className="p-5">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-sm font-bold">오늘의 루틴</h3>
                      <Badge variant="outline" className={cn("text-[10px]", isPinkMode ? "text-white border-white/50" : "")}>{completedRoutines.length} / {routines.length}</Badge>
                    </div>
                    <div className="space-y-2">
                      {routines.map(r => (
                        <div key={r.id} className="flex items-center gap-3">
                          <Checkbox checked={completedRoutines.includes(r.id)} onCheckedChange={() => setCompletedRoutines(prev => prev.includes(r.id) ? prev.filter(i => i !== r.id) : [...prev, r.id])} className={isPinkMode ? "border-white/50" : ""} />
                          <span className={cn("text-xs font-medium", completedRoutines.includes(r.id) && "line-through opacity-50")}>{r.title}</span>
                        </div>
                      ))}
                  {routines.length === 0 && <p className="text-[10px] text-center opacity-50 py-2">등록된 루틴이 없습니다.</p>}
                    </div>
                  </CardContent>
                </Card>

                <Card className={cn("w-full border-none shadow-sm rounded-3xl", isPinkMode ? "bg-white/10 text-white" : "bg-pink-50 text-pink-600")}>
                  <CardContent className="p-5 space-y-3">
                    <div className="flex justify-between items-center text-[11px] font-black uppercase">
                      <span>Refund Challenge</span>
                      <div className="flex items-center gap-2">
                        <span className="text-pink-400 font-bold">{Math.round(refundProgress)}%</span>
                        <span className="opacity-40">|</span>
                        <span>{refundDays}/30 Days</span>
                      </div>
                    </div>
                    <Progress value={refundProgress} className={cn("h-1.5", isPinkMode ? "bg-white/20" : "bg-pink-100")} />
                    <p className="text-[9px] opacity-70">4주 완성 시 22,000원 전액 환급 가능!</p>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {currentView === 'routine' && (
              <motion.div key="routine" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6 pt-4">
                <div className="flex justify-between items-end">
                  <div>
                    <h2 className="text-xl font-black tracking-tight">루틴 관리</h2>
                    <p className="text-[10px] text-gray-400">나만의 20분 챌린지 구성</p>
                  </div>
                  <Button onClick={addRoutine} size="sm" className="rounded-full bg-pink-500 shadow-md h-9 px-4 active:scale-95"><Plus className="w-4 h-4 mr-1"/>루틴 추가</Button>
                </div>
                <div className="space-y-3">
                  {routines.map(r => (
                    <div key={r.id} className="p-4 bg-gray-50/50 border border-gray-100 rounded-2xl flex items-center justify-between group hover:border-pink-100 transition-colors">
                      <div className="flex-1 flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center text-pink-500 shadow-sm"><ListTodo className="w-4 h-4"/></div>
                        {editingRoutineId === r.id ? (
                            <input 
                                autoFocus
                                value={editingTitle}
                                onChange={(e) => setEditingTitle(e.target.value)}
                                onBlur={saveRoutineEdit}
                                onKeyDown={(e) => e.key === 'Enter' && saveRoutineEdit()}
                                className="bg-white border border-pink-200 rounded-lg px-2 py-1 text-sm font-semibold text-gray-700 outline-none w-full"
                            />
                        ) : (
                            <span className="text-sm font-semibold text-gray-700">{r.title}</span>
                        )}
                      </div>
                      <div className="flex gap-1 ml-2">
                        {editingRoutineId === r.id ? (
                            <Button onClick={saveRoutineEdit} size="icon" variant="ghost" className="h-8 w-8 text-pink-500"><CheckCircle2 className="w-4 h-4" /></Button>
                        ) : (
                            <>
                                <Button onClick={() => startEditing(r)} variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-pink-500 opacity-0 group-hover:opacity-100 transition-opacity"><Pencil className="w-3.5 h-3.5" /></Button>
                                <Button onClick={() => removeRoutine(r.id)} variant="ghost" size="icon" className="h-8 w-8 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 className="w-3.5 h-3.5" /></Button>
                            </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {currentView === 'community' && (
              <motion.div key="community" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 pt-4 h-full flex flex-col">
                <div className="flex justify-between items-end">
                  <div>
                    <h2 className="text-xl font-black tracking-tight">커뮤니티</h2>
                    <p className="text-[10px] text-gray-400">캠퍼스 동기들과 함께 소통하세요</p>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={() => setIsAddFriendOpen(true)} size="icon" variant="outline" className="rounded-full w-9 h-9 border-gray-100 text-gray-400 hover:text-pink-500"><UserPlus className="w-4 h-4" /></Button>
                    <Button onClick={() => setIsCreatingPost(true)} size="icon" className="rounded-full w-9 h-9 bg-pink-500 shadow-md transform active:scale-90"><Plus className="w-5 h-5" /></Button>
                  </div>
                </div>

                <Tabs defaultValue="feed" className="flex-1 flex flex-col">
                  <TabsList className="w-full bg-gray-100 rounded-xl mb-4 h-11 p-1">
                    <TabsTrigger value="feed" className="flex-1 rounded-lg text-xs font-bold data-[state=active]:bg-white data-[state=active]:text-pink-500">피드</TabsTrigger>
                    <TabsTrigger value="friends" className="flex-1 rounded-lg text-xs font-bold data-[state=active]:bg-white data-[state=active]:text-pink-500">친구</TabsTrigger>
                    <TabsTrigger value="ranking" className="flex-1 rounded-lg text-xs font-bold data-[state=active]:bg-white data-[state=active]:text-pink-500">학교 랭킹</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="feed" className="flex-1 space-y-4 overflow-y-auto hide-scrollbar pb-10">
                    {posts.map(post => (
                      <Card key={post.id} onClick={() => setSelectedPostId(post.id)} className="border-none bg-white shadow-sm border border-gray-50 rounded-2xl cursor-pointer hover:shadow-md transition-shadow">
                        <CardContent className="p-4 space-y-3">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full bg-pink-100 flex items-center justify-center text-[10px] text-pink-500 font-bold">{post.user[0]}</div>
                              <span className="font-bold text-[12px] text-gray-900">{post.user}</span>
                            </div>
                            <span className="text-[10px] text-gray-400">{post.time}</span>
                          </div>
                          <p className="text-[12px] text-gray-700 leading-relaxed font-medium line-clamp-2">{post.content}</p>
                          <div className="flex gap-4 pt-1">
                            <button onClick={(e) => handleLike(e, post.id)} className={cn("flex items-center gap-1.5 text-[11px] transition-colors font-medium", post.likedByMe ? "text-red-500" : "text-gray-400 hover:text-pink-500")}>
                              <Heart className={cn("w-3.5 h-3.5", post.likedByMe && "fill-current")} /> {post.likes}
                            </button>
                            <span className="flex items-center gap-1.5 text-[11px] text-gray-400 font-medium">
                              <MessageCircle className="w-3.5 h-3.5" /> {post.comments.length}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </TabsContent>

                  <TabsContent value="friends" className="space-y-3 overflow-y-auto hide-scrollbar">
                    {friends.map(f => (
                      <div key={f.id} onClick={() => setSelectedFriendId(f.id)} className="flex items-center justify-between p-3.5 bg-white border border-gray-50 shadow-sm rounded-2xl cursor-pointer hover:border-pink-50 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="text-2xl w-10 h-10 flex items-center justify-center bg-gray-50 rounded-full">{f.avatar}</div>
                          <div>
                            <p className="text-sm font-bold text-gray-800">{f.name}</p>
                            <p className="text-[10px] text-gray-400 font-medium">{f.status}</p>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-200" />
                      </div>
                    ))}
                  </TabsContent>

                  <TabsContent value="ranking" className="space-y-2 overflow-y-auto hide-scrollbar">
                    {UNIVERSITY_RANKING.map(u => (
                      <div key={u.name} className="flex items-center justify-between p-3.5 bg-white border border-gray-100 rounded-2xl shadow-sm">
                        <div className="flex items-center gap-4">
                          <span className="text-xs font-black text-gray-300 w-5">{u.rank}</span>
                          <div className="w-9 h-9 rounded-full flex items-center justify-center text-[11px] text-white font-black shadow-inner" style={{ backgroundColor: u.color }}>{u.name[0]}</div>
                          <span className="text-sm font-bold text-gray-700">{u.name}</span>
                        </div>
                        <span className="text-[11px] font-black text-pink-500">{u.count}</span>
                      </div>
                    ))}
                  </TabsContent>
                </Tabs>
              </motion.div>
            )}

            {currentView === 'profile' && (
              <motion.div key="profile" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6 pt-4">
                <div className="flex items-center gap-5">
                  <div className="w-18 h-18 rounded-full bg-pink-100 flex items-center justify-center text-pink-500 shadow-md border-4 border-white"><UserIcon className="w-9 h-9" /></div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      {isEditingNickname ? (
                        <div className="flex items-center gap-2 w-full">
                          <input 
                            autoFocus
                            value={nickname}
                            onChange={(e) => setNickname(e.target.value)}
                            onBlur={() => setIsEditingNickname(false)}
                            onKeyDown={(e) => e.key === 'Enter' && setIsEditingNickname(false)}
                            className="bg-gray-50 border border-pink-200 rounded-lg px-2 py-1 text-lg font-black tracking-tight text-gray-900 outline-none w-full"
                          />
                          <button onClick={() => setIsEditingNickname(false)} className="text-pink-500 p-1"><CheckCircle2 className="w-5 h-5" /></button>
                        </div>
                      ) : (
                        <>
                          <h2 className="text-lg font-black tracking-tight">{nickname}</h2>
                          <button 
                            onClick={() => setIsEditingNickname(true)} 
                            className="text-pink-500 hover:scale-110 transition-transform p-1"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}
                    </div>
                    <Badge className="bg-pink-500 text-white border-none py-0.5 px-2 mt-1 font-bold text-[9px]">AMORE MALL LV.3 마스터</Badge>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-5 bg-gray-900 rounded-[2rem] text-white shadow-xl flex flex-col justify-between h-28">
                    <p className="text-[9px] opacity-40 uppercase font-black tracking-widest">Amore Points</p>
                    <p className="text-2xl font-black">12,450P</p>
                  </div>
                  <div className="p-5 bg-pink-500 rounded-[2rem] text-white shadow-xl flex flex-col justify-between h-28">
                    <p className="text-[9px] opacity-60 uppercase font-black tracking-widest">Active Streak</p>
                    <p className="text-2xl font-black">14 Days</p>
                  </div>
                </div>
                <Card className="border-none bg-gray-50 rounded-[2rem] shadow-sm">
                  <CardHeader className="p-6 pb-2 inline-flex items-center"><CardTitle className="text-sm font-bold flex items-center gap-2"><Smartphone className="w-4 h-4 text-pink-500" />MY 아이템</CardTitle></CardHeader>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between bg-white p-4 rounded-3xl shadow-sm border border-gray-50">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-2xl bg-pink-50 flex items-center justify-center shadow-inner"><img src={productImg} className="w-7 h-7 object-contain" referrerPolicy="no-referrer" /></div>
                        <span className="text-xs font-bold text-gray-700">펩타이드 아이패치</span>
                      </div>
                      <Badge variant="outline" className="text-[10px] font-bold border-pink-100 text-pink-500">24장</Badge>
                    </div>
                  </CardContent>
                </Card>
                <div className="pt-4 px-2">
                  <Button onClick={() => setIsLoggedIn(false)} variant="ghost" className="w-full text-gray-400 text-xs font-medium hover:text-red-500 transition-colors"><LogOut className="w-3.5 h-3.5 mr-2" /> 챌린지 로그아웃</Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* Navigation */}
        <nav className="absolute bottom-6 left-5 right-5 h-16 bg-white/95 backdrop-blur-xl rounded-[2rem] shadow-2xl border border-white/50 flex items-center justify-around px-3 z-20">
          <NavBtn active={currentView === 'home'} onClick={() => setCurrentView('home')} icon={<Home />} />
          <NavBtn active={currentView === 'routine'} onClick={() => setCurrentView('routine')} icon={<ListTodo />} />
          <NavBtn active={currentView === 'community'} onClick={() => setCurrentView('community')} icon={<Users />} />
          <NavBtn active={currentView === 'profile'} onClick={() => setCurrentView('profile')} icon={<UserIcon />} />
        </nav>

        {/* Interactions Overlays */}
        
        {/* Post Detail Overlay */}
        <FullScreenOverlay show={!!selectedPostId} onClose={() => setSelectedPostId(null)} title="게시물 상세">
          {currentPost && (
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-pink-100 flex items-center justify-center font-bold text-pink-500">{currentPost.user[0]}</div>
                <div>
                  <p className="text-sm font-bold">{currentPost.user}</p>
                  <p className="text-[10px] text-gray-400">{currentPost.time}</p>
                </div>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed font-medium">{currentPost.content}</p>
              <div className="flex gap-4 border-y border-gray-50 py-3">
                <button onClick={(e) => handleLike(e, currentPost.id)} className={cn("flex items-center gap-1.5 text-xs font-bold transition-colors", currentPost.likedByMe ? "text-red-500" : "text-gray-400")}>
                  <Heart className={cn("w-4 h-4", currentPost.likedByMe && "fill-current")} /> {currentPost.likes}
                </button>
                <span className="flex items-center gap-1.5 text-xs text-gray-400 font-bold"><MessageCircle className="w-4 h-4" /> {currentPost.comments.length}</span>
              </div>
              <div className="space-y-4">
                <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Comments</p>
                {currentPost.comments.length > 0 ? (
                  currentPost.comments.map(c => (
                    <div key={c.id} className="bg-gray-50 p-4 rounded-2xl space-y-1">
                      <p className="text-[11px] font-bold text-pink-500">{c.user}</p>
                      <p className="text-[12px] text-gray-600 font-medium">{c.text}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-center text-gray-300 py-8">댓글이 없습니다.</p>
                )}
              </div>
              <div className="absolute bottom-6 left-6 right-6">
                 <div className="relative">
                  <input 
                    type="text" 
                    value={newCommentText}
                    onChange={(e) => setNewCommentText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddComment(currentPost.id)}
                    placeholder="댓글을 입력하세요..." 
                    className="w-full h-12 bg-gray-100 rounded-full px-5 pr-12 text-xs focus:ring-2 focus:ring-pink-500 outline-none" 
                  />
                  <button onClick={() => handleAddComment(currentPost.id)} className="absolute right-3 top-1/2 -translate-y-1/2 text-pink-500"><Send className="w-5 h-5" /></button>
                </div>
              </div>
            </div>
          )}
        </FullScreenOverlay>

        {/* Create Post Overlay */}
        <FullScreenOverlay show={isCreatingPost} onClose={() => setIsCreatingPost(false)} title="글 쓰기">
          <div className="space-y-6">
            <textarea 
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              placeholder="오늘의 핑크 루틴은 어땠나요? 마음껏 공유해보세요!" 
              className="w-full h-40 resize-none border-none outline-none text-sm font-medium leading-relaxed"
            />
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1 rounded-2xl h-12 text-xs font-bold transition-all hover:bg-gray-50">사진 추가</Button>
              <Button className="flex-1 bg-pink-500 rounded-2xl h-12 text-xs font-bold shadow-lg" onClick={handleCreatePost}>올리기</Button>
            </div>
          </div>
        </FullScreenOverlay>

        {/* Friend Profile & Messaging */}
        <FullScreenOverlay show={!!selectedFriendId} onClose={() => { setSelectedFriendId(null); setIsMessaging(false); }} title={isMessaging ? (currentFriend?.name || "") : "프로필"}>
          {currentFriend && !isMessaging ? (
            <div className="flex flex-col items-center space-y-8 pt-8">
              <div className="text-6xl w-24 h-24 flex items-center justify-center bg-gray-50 rounded-full shadow-inner">{currentFriend.avatar}</div>
              <div className="text-center">
                <h3 className="text-xl font-black tracking-tight">{currentFriend.name}</h3>
                <p className="text-xs text-gray-400 font-bold mt-1 uppercase tracking-widest">{currentFriend.status}</p>
              </div>
              <div className="grid grid-cols-2 gap-4 w-full">
                <div className="bg-gray-50 p-4 rounded-3xl text-center">
                  <p className="text-[9px] text-gray-300 font-black uppercase">Streak</p>
                  <p className="text-lg font-bold text-gray-700">12 Days</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-3xl text-center">
                  <p className="text-[9px] text-gray-300 font-black uppercase">Level</p>
                  <p className="text-lg font-bold text-gray-700">LV.2</p>
                </div>
              </div>
              <Button className="w-full h-14 rounded-2xl bg-pink-500 shadow-xl font-bold flex items-center gap-2" onClick={() => setIsMessaging(true)}>
                <MessageCircle className="w-5 h-5" /> 1:1 메시지 보내기
              </Button>
            </div>
          ) : currentFriend && isMessaging ? (
            <div className="flex flex-col h-full -mt-4">
               <div className="flex-1 space-y-4 overflow-y-auto mb-20 hide-scrollbar pb-10">
                {(messages[currentFriend.id] || []).map((msg, i) => (
                  <div key={i} className={cn("flex flex-col", msg.sender === 'me' ? "items-end" : "items-start")}>
                    <div className={cn("max-w-[70%] p-3 rounded-2xl text-[12px] font-medium shadow-sm", msg.sender === 'me' ? "bg-pink-500 text-white rounded-tr-none" : "bg-gray-100 text-gray-700 rounded-tl-none")}>
                      {msg.text}
                    </div>
                    <span className="text-[8px] text-gray-300 mt-1 uppercase font-bold">{msg.time}</span>
                  </div>
                ))}
              </div>
              <div className="absolute bottom-6 left-6 right-6">
                <div className="relative">
                  <input 
                    type="text" 
                    value={newMessageText}
                    onChange={(e) => setNewMessageText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(currentFriend.id)}
                    placeholder="메시지를 입력하세요..." 
                    className="w-full h-12 bg-gray-100 rounded-full px-5 pr-12 text-xs focus:ring-2 focus:ring-pink-500 outline-none" 
                  />
                  <button onClick={() => handleSendMessage(currentFriend.id)} className="absolute right-3 top-1/2 -translate-y-1/2 text-pink-500 transition-transform active:scale-90"><Send className="w-5 h-5" /></button>
                </div>
              </div>
            </div>
          ) : null}
        </FullScreenOverlay>

        {/* Global Settings & Notifications Modals */}
        <FullScreenOverlay show={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} title="설정">
          <div className="space-y-4 pb-10">
            {["계정 설정", "알림 설정", "다크 모드", "챌린지 가이드", "공지사항", "고객센터"].map(item => (
              <div key={item} className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl cursor-pointer hover:bg-gray-100 transition-colors">
                <span className="text-sm font-bold text-gray-700">{item}</span>
                <ChevronRight className="w-4 h-4 text-gray-300" />
              </div>
            ))}
          </div>
        </FullScreenOverlay>

        <FullScreenOverlay show={isNotificationsOpen} onClose={() => setIsNotificationsOpen(false)} title="알림">
          <div className="space-y-4">
             {[
               { t: "루틴 시작 알림", c: "곧 코스알엑스 20분 챌린지 시간입니다!", d: "5분 전" },
               { t: "학교 랭킹 상승", c: "서울대학교가 1위에 등극했습니다!", d: "1시간 전" },
               { t: "친구 초대 수락", c: "이지원님이 친구 요청을 수락했습니다.", d: "3시간 전" }
             ].map((n, i) => (
              <div key={i} className="p-4 bg-gray-50 rounded-[1.5rem] relative overflow-hidden group border border-transparent hover:border-pink-100 transition-all">
                <p className="text-[10px] font-black text-pink-500 uppercase tracking-widest mb-1">{n.t}</p>
                <p className="text-xs font-bold text-gray-800 leading-tight">{n.c}</p>
                <p className="text-[9px] text-gray-300 mt-2 font-medium">{n.d}</p>
              </div>
            ))}
          </div>
        </FullScreenOverlay>

        {/* Add Friend Placeholder */}
        <FullScreenOverlay show={isAddFriendOpen} onClose={() => setIsAddFriendOpen(false)} title="친구 추가">
          <div className="space-y-6">
            <div className="relative">
              <input 
                type="text" 
                value={friendSearchQuery}
                onChange={(e) => setFriendSearchQuery(e.target.value)}
                placeholder="친구 닉네임을 입력하세요..." 
                className="w-full h-12 bg-gray-100 rounded-full px-5 text-sm font-medium outline-none focus:ring-2 focus:ring-pink-500 transition-all" 
              />
            </div>
            <div className="text-center pb-8">
              <p className="text-[10px] text-gray-300 font-bold mb-4">내 랭킹 코드: #PK99281</p>
              <Button size="lg" className="w-full bg-pink-500 rounded-2xl h-14 font-black shadow-xl" onClick={handleAddFriend}>찾기</Button>
            </div>
          </div>
        </FullScreenOverlay>

        {/* Share Overlay */}
        <FullScreenOverlay show={isShareOpen} onClose={() => setIsShareOpen(false)} title="도전 공유하기">
          <div className="space-y-6">
            <div className="bg-pink-500 rounded-[2.5rem] p-8 text-white aspect-[4/5] flex flex-col justify-between shadow-2xl relative overflow-hidden">
               {/* Background pattern */}
               <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl" />
               <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full -ml-16 -mb-16 blur-3xl" />

               <div>
                 <p className="text-[10px] font-black tracking-[0.3em] opacity-80 uppercase mb-4">20' PINK CHALLENGE</p>
                 <h4 className="text-3xl font-black leading-tight">I AM<br/>ABSORBING<br/>NOW.</h4>
               </div>

               <div className="space-y-4">
                 <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm p-4 rounded-2xl">
                   <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-pink-500"><CheckCircle2 className="w-5 h-5" /></div>
                   <div className="flex-1">
                      <p className="text-[10px] font-bold opacity-60">TODAY'S ROUTINE</p>
                      <p className="text-xs font-black">{routines.length}개 루틴 완료!</p>
                   </div>
                 </div>
                 <div className="flex justify-between items-end">
                    <p className="text-[40px] font-black leading-none">20:00</p>
                    <div className="text-right">
                       <p className="text-[10px] font-bold opacity-80">@{nickname}</p>
                       <p className="text-[8px] font-black opacity-50">POWERED BY COSRX</p>
                    </div>
                 </div>
               </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Button onClick={() => setIsShareOpen(false)} className="flex-1 bg-gray-900 rounded-2xl h-14 text-xs font-black">이미지 저장</Button>
              <Button onClick={() => setIsShareOpen(false)} className="flex-1 bg-pink-500 rounded-2xl h-14 text-xs font-black shadow-lg">인스타그램 공유</Button>
            </div>
          </div>
        </FullScreenOverlay>

        {/* Completion Modal */}
        <AnimatePresence>
          {showComplete && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-pink-500 flex flex-col items-center justify-center p-8 text-white text-center">
              <motion.div initial={{ scale: 0.5 }} animate={{ scale: 1 }} className="w-32 h-32 bg-white rounded-full flex items-center justify-center mb-8 shadow-2xl"><CheckCircle2 className="w-16 h-16 text-pink-500" /></motion.div>
              <h2 className="text-4xl font-black mb-2 tracking-tight">MISSION<br/>COMPLETE!</h2>
              <p className="text-xs mb-10 opacity-80 leading-relaxed">펩타이드가 당신의 피부에 완벽하게 스며들었습니다.<br/>오늘의 루틴을 승리로 장식하셨네요!</p>
              <div className="bg-white/20 backdrop-blur-md p-6 rounded-[2.5rem] w-full max-w-xs mb-12 flex justify-around shadow-inner"><div className="text-center font-black"><p className="text-[10px] opacity-70 uppercase tracking-widest mb-1">Point</p><p className="text-2xl">+500P</p></div><div className="text-center font-black"><p className="text-[10px] opacity-70 uppercase tracking-widest mb-1">Streak</p><p className="text-2xl">15D</p></div></div>
              <Button onClick={() => { setShowComplete(false); setTimeLeft(20 * 60); }} className="w-full max-w-xs rounded-full bg-white text-pink-500 font-black h-16 shadow-2xl active:scale-95 transition-transform">다음에 또 만나요</Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PhoneFrame>
  );
}

// --- Internal Components ---

function PhoneFrame({ children, isPinkMode = false }: { children: React.ReactNode, isPinkMode?: boolean }) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4 sm:p-8 overflow-hidden font-sans">
      <div className={cn(
        "relative w-full max-w-[390px] h-full max-h-[844px] aspect-[9/19.5] bg-white rounded-[4rem] shadow-[0_40px_100px_rgba(0,0,0,0.15)] overflow-hidden transition-colors duration-700 border-[10px] border-gray-900",
        isPinkMode ? "bg-[#FF6B9B]" : "bg-white"
      )}>
        {/* Notch Area */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-36 h-7 bg-gray-900 rounded-b-[1.75rem] z-[60] flex items-center justify-between px-6">
            <div className="w-8 h-1 bg-gray-800 rounded-full" />
            <div className="w-2 h-2 rounded-full bg-gray-800" />
        </div>
        
        {/* Safe Area Padding */}
        <div className="h-full pt-8">
          {children}
        </div>
      </div>
    </div>
  );
}

function LoginScreen({ onLogin }: { onLogin: () => void }) {
  return (
    <div className="h-full flex flex-col items-center justify-center p-10 bg-white text-center space-y-10">
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-24 h-24 bg-pink-50 rounded-[2.5rem] flex items-center justify-center text-pink-500 shadow-xl mb-6 relative overflow-hidden"
      >
        <Smartphone className="w-10 h-10 relative z-10" />
        <div className="absolute inset-0 bg-pink-100 opacity-20 animate-pulse" />
      </motion.div>
      <div>
        <h1 className="text-3xl font-black tracking-tighter text-gray-900 mb-4 leading-none">20' PINK<br/>CHALLENGE</h1>
        <p className="text-[12px] text-gray-400 font-bold px-6 leading-relaxed opacity-80 uppercase tracking-widest">Aesthetic routine tracker powered by COSRX</p>
      </div>
      <div className="w-full space-y-3 pt-8">
        <Button onClick={onLogin} className="w-full h-15 rounded-3xl bg-pink-500 text-white font-black text-sm shadow-2xl shadow-pink-100 hover:bg-pink-600 transition-all transform active:scale-95">아모레몰 아이디로 시작</Button>
        <p className="text-[10px] text-gray-300 font-bold">START YOUR 20 MINUTE REVOLUTION</p>
      </div>
      <div className="flex gap-4 pt-4 opacity-10">
        <div className="w-2 h-2 rounded-full bg-gray-400" />
        <div className="w-2 h-2 rounded-full bg-gray-400" />
        <div className="w-2 h-2 rounded-full bg-gray-400" />
      </div>
    </div>
  );
}

function NavBtn({ active, onClick, icon }: { active: boolean, onClick: () => void, icon: React.ReactNode }) {
  return (
    <button onClick={onClick} className="flex flex-col items-center justify-center p-2 relative group">
      <div className={cn("transition-all duration-300", active ? "text-pink-500 scale-125" : "text-gray-300 group-hover:text-gray-400")}>
        {React.cloneElement(icon as React.ReactElement, { size: 21, strokeWidth: active ? 3 : 2 })}
      </div>
      {active && <motion.div layoutId="nav-glow" className="absolute h-full w-full bg-pink-50 rounded-full -z-10 blur-md opacity-50" />}
    </button>
  );
}

function FullScreenOverlay({ show, onClose, title, children }: { show: boolean, onClose: () => void, title: string, children: React.ReactNode }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div 
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="absolute inset-0 z-50 bg-white flex flex-col pt-12"
        >
          <div className="px-6 flex justify-between items-center mb-6">
            <button onClick={onClose} className="p-2 -ml-2 text-gray-400 hover:text-gray-600 active:scale-90 transition-transform"><ArrowLeft className="w-6 h-6" /></button>
            <h3 className="text-base font-black tracking-tight">{title}</h3>
            <div className="w-10" />
          </div>
          <div className="flex-1 px-8 overflow-y-auto hide-scrollbar pb-10">
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
