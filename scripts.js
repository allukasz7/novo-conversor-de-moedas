const convertButton = document.querySelector(".convert-button")
const selectCurrency = document.querySelector(".select-currency")

function convertCurrency() {
    const inputCurrencyValue = document.querySelector(".input-currency").value
    const currencyValueToConvert = document.querySelector(".currency-value-to-convert")
    const currencyValueConverted = document.querySelector(".currency-value")

    console.log(selectCurrency.value)
    const dolarToday = 5.58
    const euroToday = 6.49


    if (inputCurrencyValue) {
        currencyValueToConvert.innerHTML = new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL"
        }).format(inputCurrencyValue)
    } else {
        currencyValueToConvert.innerHTML = "R$ 0,00"
    }


    if (selectCurrency.value == "Dólar Americano") { 
        currencyValueConverted.innerHTML = new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD"
        }).format(inputCurrencyValue / dolarToday)
    }

    if (selectCurrency.value == "Euro") {
        currencyValueConverted.innerHTML = new Intl.NumberFormat("de-DE", {
            style: "currency",
            currency: "EUR"
        }).format(inputCurrencyValue / euroToday)
    }
}


async function getExplanation() {

    const moedaOrigem = document.getElementById('currency-from').value; 
    const moedaDestino = document.getElementById('currency-to').value;   

    const aiExplanationDiv = document.getElementById('aiExplanation');
    aiExplanationDiv.innerHTML = '🤖 Gerando explicação com IA... (aguarde)';
    aiExplanationDiv.style.display = 'block';

    const urlServidor = 'http://127.0.0.1:5000/api/explicar';

    try {
      
        const response = await fetch(urlServidor, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
       
            body: JSON.stringify({
                origem: moedaOrigem,
                destino: moedaDestino
            })
        });

        const data = await response.json();
        

        if (response.ok) {
         
            aiExplanationDiv.innerHTML = data.explicacao; 
        } else {
        
            console.error("Erro do servidor:", data.erro);
            aiExplanationDiv.innerHTML = `❌ Erro: ${data.erro || 'Não foi possível comunicar com o servidor de IA.'}`;
        }

    } catch (error) {
 
        console.error("Erro de rede ao chamar o servidor Python:", error);
        aiExplanationDiv.innerHTML = "🔴 Erro de Conexão: Verifique se o servidor Python está ativo.";
    }
}

function changeCurrency(){
  const currencyName = document.getElementById("currency-name")
  const currencyImage = document.querySelector(".currency-img")
if (selectCurrency.value == "Dólar Americano") { 
    currencyName.innerHTML = "Dólar americano"
    currencyImage.src = "./assets/dolar.png"
  } 

if (selectCurrency.value == "Euro") { 
    currencyName.innerHTML = "Euro"
    currencyImage.src = "./assets/euro.png"
  } 

convertCurrency() 
 
}


selectCurrency.addEventListener("change", changeCurrency)
convertButton.addEventListener("click", convertCurrency)







