# TicketScraper
Construída com NodeJS, Express, Puppeteer, Cheerio, Mongoose e MongoDB, o TicketScraper foi feito para realizar web scrap de informações da conta do [Ticket](https://www.ticket.com.br/), como cartões (saldo, apelido, tipo e status), informações de contato e identificação do usuário.

A aplicação dispõe de um frontend próprio, tendo também possibilidade de consumo via API, contando com cors habilitado por padrão.

## Setup
Para rodar a aplicação é necessário ter o [NodeJS](https://nodejs.org/en/download/) instalado.

### Passo a Passo
- Clone o repositório utilizando comando `$ git clone https://github.com/luanglopes/ticket-scraper.git`
- Entre na raiz do projeto e execute o comando `npm i` para instalar as dependências do projeto
- Crie um arquivo `.env` seguindo o modelo no arquivo `example.env`
- Para rodar o projeto execute o comando:
    - Em desenvolvimento: `npm run dev`
    - Em produção: `npm start`

### API
As rotas da api são prefixadas com `/api` para evitar cinflitos com os arquivos estáticos (frontend) servidos pelo express.

`POST /api/scrap`
#### Request Body
```JSON
{
    "email": "<username>@company.com",
    "password": "<userPassword>"
}
```
#### Response Body
```JSON
{
    "user": {
        "prop": "value"
    },
    "cards": [{
        "balance": 100.00,
        "type": "Refeição",
        "status": "ativo",
        "alias": "VA Company" 
    }]
}
```

### Frontend
O Frontend é servido pela aplicação na mesma porta presente no arquivo `.env`.

A página apresentada será como um login comum, onde o usuário informa email e senha e clica em enviar para receber os dados.

Ex.: http://localhost:3000