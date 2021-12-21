'use strict'

const gridElt = document.querySelector('.grid')
const resetBtn = document.querySelector('.reset-btn')

const modalOverlayElt = document.querySelector('.modal-overlay')
const modalContainerElt = document.querySelector('.modal-container')
const modalInputs = [...document.querySelectorAll('.modal-container input')]
const modalDrawBtn = document.querySelector('.modal-container .draw-btn')
const modalCloseClickables = document.querySelectorAll('.modal-container .close')

const gridDimensions = [16, 16]
const cellsColorMap = new Map()


function hideModal(clean = true) {
	if (clean) {
		modalInputs.forEach((input, idx) => {
			input.value = gridDimensions[idx]
			input.classList.remove('invalid')
		})
	}
	modalOverlayElt.classList.add('d-none')
	modalContainerElt.classList.add('d-none')
}

function showModal() {
	modalOverlayElt.classList.remove('d-none')
	modalContainerElt.classList.remove('d-none')
}

function reset(nRows, nCols) {
	cellsColorMap.clear()
	createAndRenderCells(nRows, nCols)
}

function createCellsMarkup(n) {
	const template = '<div class="cell" data-id="@{id}" ></div>'

	let markup = ''

	for (let i = 0; i < n; i++)
		markup += template.replace('@{id}', i)

	return markup
}

function createAndRenderCells(nRows, nCols) {
	const cellsMarkup = createCellsMarkup(nRows * nCols)
	gridElt.style.gridTemplateColumns = `repeat(${nRows}, 1fr)`
	gridElt.style.gridTemplateRows = `repeat(${nCols}, 1fr)`
	document.querySelector('.grid').innerHTML = cellsMarkup
}

function colorCell(cellElt) {
	const cellId = cellElt.dataset.id

	if (!cellsColorMap.has(cellId)) {
		const rgb = new Array(3).fill(0).map(_ => Math.floor(Math.random() * 256))
		const step = rgb.map(color => (255 - color) / 10)
		cellsColorMap.set(cellId, {
			rgb,
			step,
			done: false
		})
		cellElt.style.backgroundColor = `rgb(${rgb})`
		return
	}
	const obj = cellsColorMap.get(cellId)

	if (obj.done) return

	const { rgb, step } = obj

	rgb.forEach((color, idx) => rgb[idx] = color + step[idx])

	if (rgb[0] >= 255)
		obj.done = true

	cellElt.style.backgroundColor = `rgb(${rgb})`
}

gridElt.addEventListener('mouseover', e => {
	if (!e.target.classList.contains('cell')) return
	colorCell(e.target)
})

resetBtn.addEventListener('click', e => {
	showModal()
})

modalOverlayElt.addEventListener('click', e => hideModal(true))
modalCloseClickables.forEach(clickable => clickable.addEventListener('click', e => hideModal(true)))

modalInputs.forEach(input => input.addEventListener('input', e => {
	let [n, m] = modalInputs.map(input => input.value)
	if (n === '' || m === '') {
		modalInputs.forEach(input => input.classList.add('invalid'))
		modalDrawBtn.disabled = true
		return
	}

	n = Number(n)
	m = Number(m)

	if (n * m > 100 * 100) {
		modalInputs.forEach(input => input.classList.add('invalid'))
		modalDrawBtn.disabled = true
		return
	}

	modalInputs.forEach(input => input.classList.remove('invalid'))
	modalDrawBtn.disabled = false
}))

modalDrawBtn.addEventListener('click', e => {
	[gridDimensions[0], gridDimensions[1]] = modalInputs.map(input => Number(input.value))
	hideModal()
	createAndRenderCells(...gridDimensions)
})


createAndRenderCells(...gridDimensions)
