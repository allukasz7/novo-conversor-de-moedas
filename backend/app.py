import os
from flask import Flask, request, jsonify
from flask_cors import CORS 
from google import genai
import logging


logging.basicConfig(level=logging.INFO)

app = Flask(__name__)

CORS(app) 


api_key = os.getenv('GEMINI_API_KEY')
if not api_key:
    logging.error("Variável de ambiente GEMINI_API_KEY não configurada. O servidor não funcionará.")
 

client = genai.Client(api_key=api_key)


@app.route('/api/explicar', methods=['POST'])
def explicar_moedas():

    data = request.json
    moeda_origem = data.get('origem', 'Moeda X')
    moeda_destino = data.get('destino', 'Moeda Y')
    

    prompt_text = (
        f"Explique de forma simples e interessante o que são as moedas '{moeda_origem}' e "
        f"'{moeda_destino}' e qual fator afeta a taxa de câmbio entre elas. "
        f"Mantenha a resposta concisa em português. Inclua emojis."
    )
    
    try:
      
        logging.info("Tentativa 1: Chamando Gemini...")
        response = client.models.generate_content(
            model='gemini-2.5-flash', 
            contents=prompt_text
        )

        
        return jsonify({
            'explicacao': response.text
        })
    
    except Exception as e:
       
        logging.error(f"Erro na Tentativa 1 (Gemini): {e}. Iniciando Fallback...")
        
        
        
        fallback_msg = (
            f"⚠️ **[Fallback Ativo]** Desculpe, o nosso serviço principal de IA ({os.getenv('GEMINI_MODEL', 'Gemini')}) "
            f"está temporariamente indisponível. A taxa de câmbio entre {moeda_origem} e {moeda_destino} "
            f"é afetada principalmente por fatores como a política de juros de seus respectivos bancos centrais."
        )
        
        return jsonify({
            'explicacao': fallback_msg,
            'status': 'fallback_simulado'
        }), 200 

if __name__ == '__main__':
  
    print("Servidor Flask rodando em http://127.0.0.1:5000/")
    app.run(port=5000)

