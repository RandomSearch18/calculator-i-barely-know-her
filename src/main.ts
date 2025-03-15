import "./style.css"
const inputArea = document.querySelector<HTMLTextAreaElement>("#input")!
const calculateButton = document.querySelector<HTMLButtonElement>(".calculate")!

async function answerImage(prompt: string) {
  const body = new FormData()
  body.append("text", prompt)
  body.append("image_generator_version", "standard")
  body.append("use_old_model", "false")
  body.append("turbo", "true")
  body.append("genius_preference", "classic")

  const res = await fetch("https://api.deepai.org/api/text2img", {
    method: "POST",
    body,
    headers: {
      "Api-Key": "tryit-42662075430-0e15226c78b8d0a7f6da159148ca9f08",
    },
  })

  const json = await res.json()
  alert(json.output_url)
}

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
      ? "4. Add a very high number of significant figures, e.g. 2.83210421133282113124234654657654746588728164"
      : ""
  }

  Put the final output into response tags, e.g. [res]2 * 5 + 1[endres]
  Answer in plain text. No Markdown.

  Input: <input>${expression}</value>
  `

  const requestBody = {
    contents: [{ parts: [{ text: textPrompt }] }],
  }
  const res = await fetch("https://calculate-her.mmk21-spam.workers.dev/", {
    method: "POST",
    body: JSON.stringify(requestBody),
  })
  const data = await res.json()
  const response: string = data.candidates[0].content.parts[0].text

  const finalOutputRegex = /\[res\](.*)\[endres\]/gm
  const match = finalOutputRegex.exec(response)
  if (!match) {
    alert("Invalid response")
    throw Error("Invalid response")
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

  document.querySelector(".answer")!.textContent = actualAnswer

  document.querySelector("html")!.classList.toggle("invert")
})
