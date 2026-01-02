import "./style.css"
const inputArea = document.querySelector<HTMLTextAreaElement>("#input")!
const calculateButton = document.querySelector<HTMLButtonElement>(".calculate")!

async function solve(expression: string): Promise<string> {
  const nasaMode =
    document.querySelector<HTMLInputElement>(".nasa-switch input")?.checked

  const textPrompt = `You are a calculator that takes an expression and gives a simpler expression.
  
  Follow these steps with the provided input:
  1. Come up with a numerical answer to the maths problem
  2. Then, take the numerical answer, and create an equation that's equivalent to the answer, e.g. for 11, generate 2 * 5 + 1
  3. Try to include fractions, roots (√), and exponents (^)
  ${
    nasaMode
      ? "4. Add a very high number of significant figures, e.g. 2.5340123593873"
      : ""
  }

  Put the final expression into "expression" tags, e.g. <expression>2 * 5 + 1</expression>
  You must not include anything else in the expression tags. You *MUST* include one pair of expression tags in your response.
  DO NOT provide the expression without using expression tags, as it will fail to parse.
  Answer in plain text. No Markdown.

  Input: <input>${expression}</value>
  `

  const requestBody = {
    "model": "google/gemini-2.5-flash",
    "messages": [
      {"role": "system", "content": textPrompt}
    ],
  }
  const res = await fetch("https://calculate-her.mmk21-spam.workers.dev/", {
    method: "POST",
    body: JSON.stringify(requestBody),
  })
  const data = await res.json()
  const response: string = data.choices[0].message.content

  const finalOutputRegex = /<expression>(.*)<\/expression>/gms
  const match = finalOutputRegex.exec(response)
  if (!match) {
    alert("Invalid response")
    throw Error(`Invalid response: ${response}`)
  }
  const finalOutput = match[1]
  return finalOutput
}

function getRandomInt(max: number) {
  return Math.floor(Math.random() * max)
}

calculateButton.addEventListener("click", async () => {
  const givenInput = inputArea.value

  if (!givenInput) {
    while (confirm("ENTER SOME INPUT YOU FOOL!")) {}
    return
  }

  const loadingDiv = document.createElement("div")
  loadingDiv.innerText =
    "Invoking advanced calculation procedures. Please wait."
  loadingDiv.className = "answer"
  document.querySelector(".answers")?.append(loadingDiv)

  const actualAnswer = await solve(givenInput)
  const allAnswers = await Promise.all([
    solve((getRandomInt(1000) - 500).toString()),
    actualAnswer,
    solve((getRandomInt(1000) - 500).toString()),
    solve((getRandomInt(1000) - 500).toString()),
    solve((getRandomInt(1000) - 500).toString()),
  ])

  const answerDivs = allAnswers.map((answer) => {
    const div = document.createElement("div")
    div.innerText = answer
    div.className = "answer"
    return div
  })

  document.querySelector(".answers")?.append(...answerDivs)
  loadingDiv.remove()

  document.querySelector(".answer")!.textContent = actualAnswer

  document.querySelector("html")!.classList.toggle("invert")
})
