from cryptography.fernet import Fernet
import json
import os
import random
import string
from colorama import init, Fore, Style

init(autoreset=True)

# ==================== CONFIGURAÇÃO ====================
SECRET_FILE = "secret_topics.json"
KEY_FILE = "secret_key.key"

# ==================== GERAR CHAVE ====================
def generate_key():
    if not os.path.exists(KEY_FILE):
        key = Fernet.generate_key()
        with open(KEY_FILE, "wb") as f:
            f.write(key)
        print(Fore.GREEN + "✅ Nova chave de criptografia gerada com sucesso!" + Style.RESET_ALL)
    else:
        print(Fore.YELLOW + "🔑 Chave já existe." + Style.RESET_ALL)

# ==================== CARREGAR / SALVAR ====================
def load_topics():
    generate_key()
    with open(KEY_FILE, "rb") as f:
        key = f.read()
    cipher = Fernet(key)
    
    if os.path.exists(SECRET_FILE):
        with open(SECRET_FILE, "rb") as f:
            encrypted = f.read()
        decrypted = cipher.decrypt(encrypted)
        return json.loads(decrypted)
    return {}

def save_topics(topics):
    with open(KEY_FILE, "rb") as f:
        key = f.read()
    cipher = Fernet(key)
    
    encrypted = cipher.encrypt(json.dumps(topics, indent=2, ensure_ascii=False).encode())
    with open(SECRET_FILE, "wb") as f:
        f.write(encrypted)
    print(Fore.GREEN + "✅ Tópicos salvos com segurança!" + Style.RESET_ALL)

# ==================== EXPORTAR PARA JS ====================
def export_to_js(topics):
    js_content = "// ==================== DADOS DOS TÓPICOS SECRETOS ====================\n"
    js_content += "const secretTopics = {\n"
    
    for key, data in topics.items():
        js_content += f'    "{key}": {{\n'
        js_content += f'        title: "{data["title"]}",\n'
        js_content += f'        password: "{data["password"]}",\n'
        js_content += f'        content: `{data["content"]}`\n'
        js_content += "    },\n"
    
    js_content += "};\n"
    
    with open("script_export.js", "w", encoding="utf-8") as f:
        f.write(js_content)
    print(Fore.GREEN + "✅ Exportado com sucesso para script_export.js!" + Style.RESET_ALL)
    print(Fore.CYAN + "   Copie o conteúdo desse arquivo para o seu script.js" + Style.RESET_ALL)

# ==================== MENU PRINCIPAL ====================
def menu():
    topics = load_topics()
    
    while True:
        print("\n" + "="*60)
        print(Fore.CYAN + "          GERENCIADOR SAIBAMAIS" + Style.RESET_ALL)
        print("="*60)
        print("1. Adicionar novo tópico secreto")
        print("2. Listar tópicos cadastrados")
        print("3. Gerar senha forte")
        print("4. Exportar para script.js")
        print("0. Sair")
        
        op = input("\nEscolha uma opção: ").strip()

        if op == "1":
            titulo = input(Fore.YELLOW + "Título do tópico: " + Style.RESET_ALL)
            chave = input(Fore.YELLOW + "Senha de acesso: " + Style.RESET_ALL)
            print(Fore.YELLOW + "Conteúdo (pode usar HTML - digite e pressione Enter duas vezes para finalizar):" + Style.RESET_ALL)
            lines = []
            while True:
                line = input()
                if line == "":
                    break
                lines.append(line)
            conteudo = "\n".join(lines)
            
            key_name = titulo.lower().replace(" ", "").replace("ç", "c").replace("ã", "a").replace("é", "e")
            
            topics[key_name] = {
                "title": titulo,
                "password": chave,
                "content": conteudo
            }
            save_topics(topics)

        elif op == "2":
            if not topics:
                print(Fore.RED + "Nenhum tópico cadastrado ainda." + Style.RESET_ALL)
            else:
                print(Fore.YELLOW + "\nTópicos cadastrados:" + Style.RESET_ALL)
                for k, v in topics.items():
                    print(f"• {k} → {v['title']}")

        elif op == "3":
            senha = ''.join(random.choices(string.ascii_letters + string.digits + "!@#$%&*_", k=16))
            print(Fore.GREEN + f"🔑 Senha forte gerada: {senha}" + Style.RESET_ALL)

        elif op == "4":
            export_to_js(topics)

        elif op == "0":
            print(Fore.CYAN + "👋 Até mais! Mantenha o segredo." + Style.RESET_ALL)
            break
        else:
            print(Fore.RED + "Opção inválida! Tente novamente." + Style.RESET_ALL)

if __name__ == "__main__":
    menu()
    