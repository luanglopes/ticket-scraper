const state = {
  isLoading: false,
  informationContainer: null
}

const renderError = () => {
  state.informationContainer.innerHTML = '<h2 id="error-message">Ops! Ocorreu um erro, verifique o email e senha e tente novamente ou tente novamente mais tarde</h2> '
}

const renderUser = (user) => {
  const table = document.createElement('table')

  const rows = Object.keys(user).map(key => {
    const row = document.createElement('tr')

    const infoName = document.createElement('td')
    infoName.innerText = key.toLowerCase()

    const infoValue = document.createElement('td')
    infoValue.innerText = user[key]

    row.append(infoName)
    row.append(infoValue)

    return row
  })

  table.append(...rows)

  return table
}

const renderCards = (cards) => {
  const cardsList = document.createElement('ul')

  const listItems = cards.map(card => {
    const listItem = document.createElement('li')
    const table = document.createElement('table')

    const typeRow = document.createElement('tr')
    typeRow.innerHTML = `<td>Tipo</td><td>${card.type}</td>`

    const balanceRow = document.createElement('tr')
    balanceRow.innerHTML = `<td>Saldo</td><td>R$ ${card.balance}</td>`.replace('.', ',')

    const aliasRow = document.createElement('tr')
    aliasRow.innerHTML = `<td>Apelido</td><td>${card.alias}</td>`

    const statusRow = document.createElement('tr')
    statusRow.innerHTML = `<td>Status</td><td>${card.status}</td>`

    table.append(typeRow, balanceRow, aliasRow, statusRow)

    listItem.append(table)

    return listItem
  })

  cardsList.append(...listItems)

  return cardsList
}

const renderInformation = (data) => {
  const { user, cards } = data

  state.informationContainer.innerHTML = ''

  const userContainer = document.createElement('div')
  const cardsContainer = document.createElement('div')

  userContainer.innerHTML = '<h2>Dados do usuário</h2>'
  cardsContainer.innerHTML = '<h2>Cartões</h2>'

  const userElemnt = renderUser(user)
  const cardsElement = renderCards(cards)

  userContainer.append(userElemnt)
  cardsContainer.append(cardsElement)

  state.informationContainer.append(userContainer, cardsContainer)
}

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form')
  state.informationContainer = document.getElementById('information')

  loginForm.onsubmit = (event) => {
    event.preventDefault()

    const email = document.getElementById('email').value
    const password = document.getElementById('password').value

    if (!state.isLoading) {
      state.isLoading = true

      const submitButton = document.getElementById('submit-button')
      submitButton.setAttribute('disabled', 'true')

      state.informationContainer.innerHTML = '<span>Buscando seus dados...</span>'

      fetch('/api/scrap', {
        method: 'POST',
        mode: 'cors',
        body: JSON.stringify({ email, password }),
        headers: { 'content-type': 'application/json' }
      })
        .then(res => res.json())
        .then(renderInformation)
        .catch(renderError)
        .finally(() => {
          state.isLoading = false
          submitButton.removeAttribute('disabled')
        })
    }
  }
})
