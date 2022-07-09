const tableStepAmount = 10
let sequencePolynomial, currentTableRow = 1

function showInputError(element, message) {
    element.setCustomValidity(message)
    element.reportValidity()
}

function createTableOfValues() {
    $("#sequence-table").empty()

    $("#sequence-table").append($("<tr>")
        .append($("<td>").append("$$n$$"))
        .append($("<td>").append("$$f(n)$$"))
    )

    currentTableRow = 1

    showMoreValues()

    $("#sequence-show-more-button").show()
}

function showMoreValues() {
    if (!sequencePolynomial) {
        return
    }

    let tableBody = $("#sequence-table")

    nerdamer.clearVars()

    for (let i = currentTableRow; i < currentTableRow + tableStepAmount; ++i) {
        nerdamer.setVar("n", i)

        tableBody.append($("<tr>")
            .append($("<td>").append(`$$${i}$$`))
            .append($("<td>").append(convertToLatex(nerdamer(sequencePolynomial))))
        )
    }

    nerdamer.clearVars()

    currentTableRow += tableStepAmount
}

const testPointRegex = /^(\(\s*([0-9-.a-z_αAβBγΓδΔϵEζZηHθΘιIκKλΛμMνNξΞoOπΠρPσΣτTυϒϕΦχXψΨωΩ]+)\s*(\s+|,)\s*([0-9-.a-z_αAβBγΓδΔϵEζZηHθΘιIκKλΛμMνNξΞoOπΠρPσΣτTυϒϕΦχXψΨωΩ]+)\s*\)[, ]*)+$/i,
      pointRegex = /\(\s*([0-9-.a-z_αAβBγΓδΔϵEζZηHθΘιIκKλΛμMνNξΞoOπΠρPσΣτTυϒϕΦχXψΨωΩ]+)\s*(\s+|,)\s*([0-9-.a-z_αAβBγΓδΔϵEζZηHθΘιIκKλΛμMνNξΞoOπΠρPσΣτTυϒϕΦχXψΨωΩ]+)\s*\)[, ]*/gi

$(document).ready(function() {
    $("#terms-value").keyup(function() {
        $("#terms-value")[0].setCustomValidity("")
    })

    $("#sequence-info").submit(function(event) {
        event.preventDefault()

        const inputString = $("#terms-value").val(), isPointFormat = testPointRegex.test(inputString)

        let inputValues

        if (isPointFormat) {
            /*
            // This won't work if there's a variable because the variables (a, b, c, etc.) aren't defined

            try {
                inputValues = JSON.parse("[" + inputString.replaceAll("(", "[").replaceAll(")", "]") + "]")
            } catch (err) {
                hasError = true
            }

            if (!hasError) {
                for (let i = 0; i < inputValues; ++i) {
                    if (inputValues[i].constructor !== Array || inputValues[i].length != 2) {
                        hasError = true
                        break
                    }
                }
            }
            */

            inputValues = []

            let m

            while (m = pointRegex.exec(inputString)) {
                inputValues.push([m[1], m[3]])
            }

            const xValues = new Set(inputValues.map(pair => pair[0]))

            if (inputValues.length != xValues.size) {
                showInputError($("#terms-value")[0], "The x values must be unique")
                return
            }

        } else {
            inputValues = inputString.trim().split(/\s+|,\s*/)

            if (!inputValues.every(Boolean)) {
                showInputError($("#terms-value")[0], "Invalid input")
                return
            }
        }

        try {
            sequencePolynomial = findPolynomialFunction(inputValues, isPointFormat)

        } catch (err) {
            showInputError($("#terms-value")[0], `Error:\n${err.message}`)
            return
        }

        const latexPolynomial = convertToLatex(sequencePolynomial)

        $("#polynomial-function").text(latexPolynomial)

        createTableOfValues()

        MathJax.typeset()
    })

    $("#sequence-show-more-button").click(function() {
        showMoreValues()

        MathJax.typeset()
    })
})

function valuesToPoints(values) {
    let points = []

    for (let i = 0; i < values.length; ++i) {
        if (values[i] == "?") {
            continue
        }

        points.push([i + 1, values[i]])
    }

    return points
}

function lagrangeInterpolation(points) {
    let polynomial = nerdamer("0")

    for (let i = 0; i < points.length; ++i) {
        const pointi = points[i], xi = pointi[0], yi = pointi[1]

        let currentPolynomial = nerdamer("1")

        for (let j = 0; j < points.length; ++j) {
            if (i == j) {
                continue
            }

            const pointj = points[j], xj = pointj[0], yj = pointj[1]

            currentPolynomial = currentPolynomial.multiply(`n - ${xj}`).divide(`${xi} - ${xj}`)
        }

        polynomial = polynomial.add(nerdamer(currentPolynomial).multiply(yi))
    }

    return nerdamer.expand(polynomial)
}

function convertToLatex(polynomialFunction) {
    return "$$" + "f(n)=" + polynomialFunction.toTeX() + "$$"
}

function findPolynomialFunction(inputValues, arePoints = false) {
    const points = arePoints ? inputValues : valuesToPoints(inputValues)

    return lagrangeInterpolation(points)
}
