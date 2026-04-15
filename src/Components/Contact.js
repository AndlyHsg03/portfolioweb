import { Component } from 'react';
import { Fade } from 'react-awesome-reveal';
import ProfileAI from '../images/ProfileAI.jpg';
class Contact extends Component {
    constructor(props) {
        super(props);
        this.state = {
            messages: [
                {
                    role: 'bot',
                    text: '👋 Halo! Aku asisten AI Adly. Tanya apa aja tentang Adly — skill, kuliah, project, atau cara kontaknya!'
                }
            ],
            inputValue: '',
            isLoading: false
        };
        this.messagesEndRef = null;
    }

    scrollToBottom = () => {
        if (this.messagesEndRef) {
            this.messagesEndRef.scrollIntoView({ behavior: 'smooth' });
        }
    };

    

    handleInputChange = (e) => {
        this.setState({ inputValue: e.target.value });
    };

    handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            this.sendMessage();
        }
    };

    sendMessage = async () => {
        const { inputValue, messages, isLoading } = this.state;
        if (!inputValue.trim() || isLoading) return;

        const userMessage = { role: 'user', text: inputValue.trim() };
        const historyToSend = messages.slice(1);

        this.setState(prev => ({
            messages: [...prev.messages, userMessage],
            inputValue: '',
            isLoading: true
        }));

        try {
            // ✅ Panggil backend — API key tidak pernah terkirim ke browser
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: inputValue.trim(),
                    history: historyToSend
                })
            });

            const data = await response.json();

            if (!response.ok) throw new Error(data.error || 'Server error');

            this.setState(prev => ({
                messages: [...prev.messages, { role: 'bot', text: data.reply }],
                isLoading: false
            }));

        } catch (err) {
            this.setState(prev => ({
                messages: [...prev.messages, {
                    role: 'bot',
                    text: 'Aduh, ada masalah koneksi nih 😅 Coba lagi sebentar ya!'
                }],
                isLoading: false
            }));
        }
    };

    handleQuickQuestion = (question) => {
        this.setState({ inputValue: question }, () => this.sendMessage());
    };

    render() {
        const { messages, inputValue, isLoading } = this.state;

        const quickQuestions = [
            '🧠 Skill apa yang dikuasai?',
            '🎓 Kuliah dimana?',
            '📞 Gimana cara kontaknya?',
            '📍 Asalnya dari mana?',
            '💻 Ada project apa?'
        ];

        const css = `
            @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

            #contact {
                background: #070711;
                padding: 90px 0 80px;
                position: relative;
                overflow: hidden;
                font-family: 'DM Sans', sans-serif;
            }
            #contact::before {
                content: '';
                position: absolute;
                width: 600px; height: 600px;
                top: -200px; left: -200px;
                background: radial-gradient(circle, rgba(109,40,217,0.14) 0%, transparent 65%);
                pointer-events: none;
                z-index: 0;
            }
            #contact::after {
                content: '';
                position: absolute;
                width: 500px; height: 500px;
                bottom: -150px; right: -150px;
                background: radial-gradient(circle, rgba(6,182,212,0.1) 0%, transparent 65%);
                pointer-events: none;
                z-index: 0;
            }

            .contact-wrap {
                max-width: 700px;
                margin: 0 auto;
                padding: 0 28px;
                position: relative;
                z-index: 1;
            }

            /* Header */
            .contact-header { text-align: center; margin-bottom: 42px; }

            .ai-badge {
                display: inline-flex; align-items: center; gap: 8px;
                background: rgba(109,40,217,0.08);
                border: 1px solid rgba(109,40,217,0.22);
                border-radius: 100px; padding: 6px 18px 6px 10px;
                margin-bottom: 22px;
            }
            .ai-badge-icon {
                width: 28px; height: 28px; border-radius: 50%;
                background: linear-gradient(135deg, #7c3aed, #4f46e5);
                display: flex; align-items: center; justify-content: center;
                font-size: 13px; box-shadow: 0 0 14px rgba(124,58,237,0.5);
            }
            .ai-badge-text {
                font-size: 0.7rem; font-weight: 700; letter-spacing: 1.5px;
                text-transform: uppercase; color: #a78bfa;
            }
            .online-dot {
                width: 6px; height: 6px; background: #10b981; border-radius: 50%;
                box-shadow: 0 0 6px #10b981;
                animation: onlinePulse 2s infinite;
            }
            @keyframes onlinePulse {
                0%,100% { opacity:1; transform:scale(1); }
                50% { opacity:0.5; transform:scale(0.8); }
            }

            .contact-title {
                font-size: clamp(1.9rem, 5vw, 2.75rem);
                font-weight: 700; letter-spacing: -0.5px; line-height: 1.15;
                margin: 0 0 12px;
                background: linear-gradient(130deg, #ede9fe 0%, #a78bfa 40%, #67e8f9 100%);
                -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
            }
            .contact-sub { color: #3d4f63; font-size: 0.92rem; margin: 0; }

            /* Card */
            .chat-card {
                background: rgba(12,10,25,0.85);
                border: 1px solid rgba(255,255,255,0.055);
                border-radius: 22px; overflow: hidden;
                box-shadow:
                    0 50px 100px rgba(0,0,0,0.7),
                    0 0 0 1px rgba(109,40,217,0.06),
                    inset 0 1px 0 rgba(255,255,255,0.04);
                backdrop-filter: blur(24px);
            }

            /* Topbar */
            .chat-topbar {
                padding: 15px 20px;
                border-bottom: 1px solid rgba(255,255,255,0.05);
                background: rgba(0,0,0,0.25);
                display: flex; align-items: center; justify-content: space-between;
            }
            .topbar-left { display: flex; align-items: center; gap: 12px; }
            
            .bot-name { font-size: 0.87rem; font-weight: 600; color: #e2e8f0; display: block; }
            .bot-status {
                font-size: 0.7rem; color: #10b981; display: flex;
                align-items: center; gap: 5px; margin-top: 3px;
            }
            .status-dot { width: 5px; height: 5px; background: #10b981; border-radius: 50%; }
            .topbar-dots { display: flex; gap: 6px; }
            .dot { width: 10px; height: 10px; border-radius: 50%; }
            .dot-r { background: #ff5f57; }
            .dot-y { background: #febc2e; }
            .dot-g { background: #28c840; }

            /* Messages */
            .msgs {
                height: 370px; overflow-y: auto; padding: 22px 20px;
                display: flex; flex-direction: column; gap: 14px;
                scrollbar-width: thin; scrollbar-color: rgba(109,40,217,0.15) transparent;
            }
            .msgs::-webkit-scrollbar { width: 3px; }
            .msgs::-webkit-scrollbar-thumb { background: rgba(109,40,217,0.18); border-radius: 2px; }

            .msg-row {
                display: flex; align-items: flex-end; gap: 10px;
                animation: msgSlide 0.28s cubic-bezier(0.16,1,0.3,1);
            }
            @keyframes msgSlide {
                from { opacity:0; transform:translateY(10px); }
                to { opacity:1; transform:translateY(0); }
            }
            .msg-row.mine { flex-direction: row-reverse; }

            .av {
    width: 32px;
    height: 32px;
    border-radius: 50%; /* 🔥 penting */
    overflow: hidden;   /* 🔥 ini kunci */
    display: flex;
    align-items: center;
    justify-content: center;
}
            .bot-av { background: linear-gradient(135deg,#6d28d9,#4338ca); box-shadow:0 2px 10px rgba(109,40,217,0.4); }
            .user-av { background: linear-gradient(135deg,#0e7490,#0369a1); box-shadow:0 2px 10px rgba(14,116,144,0.4); }

            .bubble {
                max-width: 78%; padding: 11px 16px;
                font-size: 0.875rem; line-height: 1.7;
                word-wrap: break-word; white-space: pre-wrap;
            }
            .bot-bub {
                background: rgba(109,40,217,0.09); border: 1px solid rgba(109,40,217,0.17);
                color: #c4b5fd; border-radius: 18px 18px 18px 4px;
            }
            .user-bub {
                background: rgba(14,116,144,0.11); border: 1px solid rgba(14,116,144,0.2);
                color: #7dd3fc; border-radius: 18px 18px 4px 18px;
            }

            .typing { display:flex; gap:5px; align-items:center; padding:3px 0; }
            .typing span {
                width:7px; height:7px; background:#7c3aed; border-radius:50%;
                animation: typeBounce 1.2s ease-in-out infinite;
            }
            .typing span:nth-child(2) { animation-delay:0.16s; }
            .typing span:nth-child(3) { animation-delay:0.32s; }
            @keyframes typeBounce {
                0%,60%,100% { transform:translateY(0); opacity:0.3; }
                30% { transform:translateY(-8px); opacity:1; }
            }

            /* Input zone */
            .input-meta {
                padding: 0 20px 8px;
                background: rgba(0,0,0,0.3);
                display: flex; justify-content: flex-end;
            }
            .char-c { font-size:0.67rem; color:#1e293b; font-family:'JetBrains Mono',monospace; }

            .input-zone {
                padding: 14px 18px;
                border-top: 1px solid rgba(255,255,255,0.05);
                background: rgba(0,0,0,0.3);
                display: flex; gap: 10px; align-items: center;
            }
            .msg-input {
                flex: 1;
                background: rgba(255,255,255,0.04);
                border: 1px solid rgba(255,255,255,0.07);
                border-radius: 13px; padding: 12px 18px;
                color: #e2e8f0; font-size: 0.875rem;
                font-family: 'DM Sans', sans-serif;
                outline: none; transition: border-color 0.2s, background 0.2s;
            }
            .msg-input:focus {
                border-color: rgba(109,40,217,0.42);
                background: rgba(91, 65, 65, 0.06);
            }
            .msg-input::placeholder { color: #babcbe; }
            .msg-input:disabled { opacity: 0.5; }

            .send-btn {
                width: 46px; height: 46px; border-radius: 13px;
                background: linear-gradient(135deg,#7c3aed,#4f46e5);
                border: none; cursor: pointer;
                display: flex; align-items: center; justify-content: center;
                color: white; font-size: 1rem;
                transition: all 0.2s;
                box-shadow: 0 4px 16px rgba(124,58,237,0.4);
                flex-shrink: 0;
            }
            .send-btn:hover:not(:disabled) {
                transform: translateY(-2px);
                box-shadow: 0 8px 24px rgba(124,58,237,0.55);
            }
            .send-btn:disabled { opacity:0.3; cursor:not-allowed; transform:none; box-shadow:none; }

            /* Quick questions */
            .quick-section { margin-top: 20px; }
            .quick-label {
                font-size: 0.68rem; font-weight: 700; letter-spacing: 1.2px;
                text-transform: uppercase; color: #1e293b; margin-bottom: 10px; display: block;
            }
            .quick-btns { display: flex; flex-wrap: wrap; gap: 8px; }
            .qq {
                background: rgba(255,255,255,0.025);
                border: 1px solid rgba(255,255,255,0.06);
                border-radius: 10px; padding: 7px 14px;
                color: #3d4f63; font-size: 0.78rem;
                cursor: pointer; transition: all 0.18s;
                font-family: 'DM Sans', sans-serif; font-weight: 500;
            }
            .qq:hover {
                background: rgba(109,40,217,0.1);
                border-color: rgba(109,40,217,0.28);
                color: #a78bfa; transform: translateY(-1px);
            }
            .qq:disabled { opacity:0.35; cursor:not-allowed; transform:none; }

            @media (max-width:500px) {
                .contact-wrap { padding: 0 16px; }
                .msgs { height: 300px; }
                .bubble { max-width: 88%; }
                .topbar-dots { display: none; }
            }
        `;

        return (
            <section id="contact">
                <style>{css}</style>
                <Fade triggerOnce>
                    <div className="contact-wrap">

                        <div className="contact-header">
                            
                            <h2 className="contact-title">Chat dengan AI Asisten Adly</h2>
                            <p className="contact-sub">Tanya apapun tentang Adly — skill, kuliah, project, atau kontak!</p>
                        </div>

                        <div className="chat-card">
                            <div className="chat-topbar">
                                <div className="topbar-left">
                                    <div >
                                        <img 
  src={ProfileAI} 
  alt="Profile Adly" 
  style={{ width: '40px', height: '40px' }} 
/>
                                    </div>
                                    <div>
                                        <span className="bot-name">Adly AI Assistant</span>
                                        <div className="bot-status">
                                            <div className="status-dot" /> Online
                                        </div>
                                    </div>
                                </div>
                                <div className="topbar-dots">
                                    <div className="dot dot-r" />
                                    <div className="dot dot-y" />
                                    <div className="dot dot-g" />
                                </div>
                            </div>

                            <div className="msgs">
                                {messages.map((msg, idx) => (
                                    <div key={idx} className={`msg-row ${msg.role === 'user' ? 'mine' : ''}`}>
  <div className={`av ${msg.role === 'user' ? 'user-av' : 'bot-av'}`}>
    {msg.role === 'user' 
      ? '👤' 
      : <img 
          src={ProfileAI} 
          alt="Adly" 
          style={{ width: '100%', height: '100%', borderRadius: 'inherit' }} 
        />
    }
  </div>

  <div className={`bubble ${msg.role === 'user' ? 'user-bub' : 'bot-bub'}`}>
    {msg.text}
  </div>
</div>
                                ))}
                                {isLoading && (
                                    <div className="msg-row">
                                        <div className="av bot-av">
                                            {ProfileAI && <img src={ProfileAI} alt="Adly" style={{ width: '100%', height: '100%', borderRadius: 'inherit' }} />}
                                        </div>
                                        <div className="bubble bot-bub">
                                            <div className="typing"><span /><span /><span /></div>
                                        </div>
                                    </div>
                                )}
                                <div ref={el => { this.messagesEndRef = el; }} />
                            </div>

                            <div className="input-meta">
                                <span className="char-c">{inputValue.length}/300</span>
                            </div>
                            <div className="input-zone">
                                <input
                                    type="text"
                                    className="msg-input"
                                    placeholder="Ketik pertanyaan... (Enter untuk kirim)"
                                    value={inputValue}
                                    onChange={this.handleInputChange}
                                    onKeyDown={this.handleKeyDown}
                                    disabled={isLoading}
                                    maxLength={300}
                                />
                                <button
                                    className="send-btn"
                                    onClick={this.sendMessage}
                                    disabled={isLoading || !inputValue.trim()}
                                >➤</button>
                            </div>
                        </div>

                        <div className="quick-section">
                            <span className="quick-label">Coba tanya ini →</span>
                            <div className="quick-btns">
                                {quickQuestions.map((q, i) => (
                                    <button key={i} className="qq"
                                        onClick={() => this.handleQuickQuestion(q)}
                                        disabled={isLoading}>
                                        {q}
                                    </button>
                                ))}
                            </div>
                        </div>

                    </div>
                </Fade>
            </section>
        );
    }
}

export default Contact;
