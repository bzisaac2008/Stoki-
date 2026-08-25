import { useState } from "react";
import "./Login.css";

const API_URL = "http://localhost:3000/api";

function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [lembrar, setLembrar] = useState(false);

  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function fazerLogin(event) {
    event.preventDefault();
    setErro("");

    if (!email.trim()) {
      setErro("Informe seu email.");
      return;
    }

    if (!senha) {
      setErro("Informe sua senha.");
      return;
    }

    try {
      setCarregando(true);

      const resposta = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: email.trim(),
          senha,
          lembrar
        })
      });

      const data = await resposta.json();

      if (!resposta.ok) {
        throw new Error(data?.erro || "Email ou senha inválidos.");
      }

      localStorage.setItem("usuario", JSON.stringify(data.usuario));
      window.location.href = "/";

    } catch (error) {
      console.error("Erro ao fazer login:", error);
      setErro(error.message);
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="stoki-page">
      <div className="stoki-card">
        
        {/* LADO ESQUERDO: INFRA / BRANDING */}
        <div className="stoki-left">
          <div className="stoki-header">
            <div className="stoki-brand-logo">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                <line x1="12" y1="22.08" x2="12" y2="12" />
              </svg>
            </div>
            <div>
              <h1 className="stoki-title">Stoki</h1>
              <p className="stoki-subtitle">Sistema de Gestão de Estoque</p>
            </div>
          </div>

          <div className="stoki-hero">
            <h2>
              Gerencie seu estoque<br />
              de forma <span>simples e eficiente</span>
            </h2>
            <p>
              Controle produtos, categorias, movimentações<br />
              e muito mais em um só lugar.
            </p>
          </div>

          <div className="stoki-illustration">
            {/* Mockup do Dashboard */}
            <div className="mockup-screen">
              <div className="mockup-nav">
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
              </div>
              <div className="mockup-body">
                <div className="mockup-sidebar">
                  <div className="sb-item active">Dashboard</div>
                  <div className="sb-item">Produtos</div>
                  <div className="sb-item">Categorias</div>
                  <div className="sb-item">Movimentações</div>
                </div>
                <div className="mockup-content">
                  <div className="mockup-cards">
                    <div className="m-card">
                      <small>Produtos</small>
                      <strong>152</strong>
                    </div>
                    <div className="m-card">
                      <small>Categorias</small>
                      <strong>24</strong>
                    </div>
                    <div className="m-card">
                      <small>Movimentações</small>
                      <strong>89</strong>
                    </div>
                  </div>
                  <div className="mockup-chart">
                    <svg viewBox="0 0 100 40" className="chart-line">
                      <path d="M0,30 Q20,10 40,25 T80,15 T100,20" fill="none" stroke="#2563eb" strokeWidth="2"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Elementos decorativos (Caixas e Prancheta) */}
            <div className="mockup-box-big">📦</div>
            <div className="mockup-shelf">
              <div className="shelf-box">📦</div>
              <div className="shelf-box">📦</div>
            </div>
            <div className="mockup-clipboard">
              <div className="check-item">✓</div>
              <div className="check-item">✓</div>
            </div>
          </div>

          <div className="stoki-features">
            <div className="feature-item">
              <div className="feature-icon">📦</div>
              <div>
                <strong>Controle completo</strong>
                <p>Gerencie produtos, categorias e estoque com facilidade.</p>
              </div>
            </div>
            <div className="feature-item">
              <div className="feature-icon">📊</div>
              <div>
                <strong>Relatórios inteligentes</strong>
                <p>Acompanhe movimentações e gere relatórios detalhados.</p>
              </div>
            </div>
            <div className="feature-item">
              <div className="feature-icon">🛡️</div>
              <div>
                <strong>Seguro e confiável</strong>
                <p>Seus dados protegidos com segurança avançada.</p>
              </div>
            </div>
          </div>
        </div>

        {/* LADO DIREITO: FORMULÁRIO */}
        <div className="stoki-right">
          <div className="login-card">
            <div className="login-icon-badge">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
            </div>

            <h2>Bem-vindo de volta!</h2>
            <p className="login-subtext">Faça login para acessar sua conta</p>

            {erro && (
              <div className="stoki-error-msg">
                {erro}
              </div>
            )}

            <form onSubmit={fazerLogin}>
              <div className="stoki-field">
                <label>E-mail</label>
                <div className="input-box">
                  <svg className="field-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                  <input
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="stoki-field">
                <label>Senha</label>
                <div className="input-box">
                  <svg className="field-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                  <input
                    type={mostrarSenha ? "text" : "password"}
                    placeholder="••••••••"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                  />
                  <button
                    type="button"
                    className="toggle-eye"
                    onClick={() => setMostrarSenha(!mostrarSenha)}
                  >
                    👁
                  </button>
                </div>
              </div>

              <div className="stoki-row-between">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={lembrar}
                    onChange={(e) => setLembrar(e.target.checked)}
                  />
                  <span>Lembrar de mim</span>
                </label>

                <a href="#esqueceusenha" className="forgot-link">
                  Esqueci minha senha
                </a>
              </div>

              <button type="submit" className="stoki-btn-primary" disabled={carregando}>
                {carregando ? "Entrando..." : "→] Entrar"}
              </button>
            </form>

            <div className="divider">
              <span>ou</span>
            </div>

            <button type="button" className="stoki-btn-outline">
              👤 Criar nova conta
            </button>
          </div>

          <div className="stoki-copyright">
            © 2024 Stoki. Todos os direitos reservados.
          </div>
        </div>

      </div>
    </div>
  );
}

export default Login;