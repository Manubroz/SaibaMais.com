#Saiba Mais#
# SaibaMais 🕵️‍♂️

**SaibaMais** é um sistema híbrido de gerenciamento e exibição de conteúdos restritos. Ele funciona através de uma interface web "camuflada" que, à primeira vista, exibe conteúdos genéricos (Educação, Tecnologia, Curiosidades). No entanto, através de um sistema de busca oculta e proteção por senha, o usuário pode revelar e acessar tópicos secretos.

O projeto é dividido em duas partes principais: um gerenciador seguro em **Python** (CLI) para criar e criptografar os dados localmente, e uma interface **Web (HTML/CSS/JS)** para consultar e acessar esses dados.

---

## ✨ Funcionalidades

### 🖥️ Gerenciador Python (Backend Local)
* **Criptografia Forte:** Utiliza a biblioteca `Fernet` (simétrica) para manter os tópicos seguros no arquivo `secret_topics.json`.
* **Geração de Senhas:** Ferramenta integrada para gerar senhas fortes e aleatórias (16 caracteres).
* **Exportação Automática:** Converte os dados criptografados locais para um formato JavaScript pronto para ser usado no frontend.

### 🌐 Interface Web (Frontend)
* **Design de Camuflagem:** Interface inicial amigável que esconde o real propósito da página.
* **Busca Secreta:** Tópicos ocultos só aparecem quando pesquisados pelo nome ou palavra-chave.
* **Sistema de Senhas:** Modal de acesso que exige a senha específica do tópico para desbloqueio.
* **Chave Mestre:** Uma senha global capaz de desbloquear todos os tópicos de uma vez.
* **Segurança de Tentativas:** Bloqueio temporário (via `localStorage`) após 3 tentativas incorretas de senha.
* **Persistência de Sessão:** Tópicos desbloqueados permanecem abertos para o usuário na mesma máquina.

---

## 🛠️ Tecnologias Utilizadas

* **Frontend:** HTML5, CSS3, JavaScript (Vanilla).
* **Backend/Gerenciador:** Python 3.
* **Bibliotecas Python:** * `cryptography` (Para criptografia dos dados locais).
  * `colorama` (Para interface colorida no terminal).

---

## 🚀 Como Instalar e Configurar

### 1. Pré-requisitos
Certifique-se de ter o [Python 3](https://www.python.org/downloads/) instalado na sua máquina.

### 2. Instalação das dependências Python
Abra o terminal na pasta do projeto e instale as bibliotecas necessárias executando:

```bash
pip install cryptography colorama