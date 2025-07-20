# Help Now
Help Now – Chamado rápido, resposta imediata.
O Help Now é uma aplicação web de chamados pensada pra redes locais. Simples, leve e de fácil uso, ele conecta pontos da rede em tempo real através de um WebSocket, garantindo uma comunicação rápida e estável entre usuários e o host.

A mágica rola com dois servidores locais, cada um rodando em uma porta separada:
- Um cuida do host (central de suporte)
- Outro do usuário (quem precisa de ajuda)

Nada de depender de internet externa ou sistemas engessados. O Help Now é direto ao ponto: você chama, o suporte responde. É como um interfone digital – só que muito mais esperto.

Quer um sistema de chamado que não te deixa na mão? Tá na hora de conhecer o Help Now.

## Instalação

O processo pode ser feito de duas formas. E vai de você decidir como quer. Ou você pode simplesmente deixar tudo na mão dos scripts pré escritos.

### 1. Instalação automática

A maneira mais prática é executar o seguinte comando:

```bash
npm run generate-files
```

Esse comando executa um script que:

* Cria o arquivo `.env` com as portas padrão
* Detecta automaticamente o IP local (IPv4)
* Prepara o ambiente para os servidores funcionarem corretamente

### 2. Instalação manual

Caso prefira definir manualmente as portas utilizadas, é possível executar:

```bash
node generate-env.js <HOST_PORT> <HOST_WEBSOCKET_PORT> <CLIENT_PORT>
```

Exemplo:

```bash
node generate-env.js 3000 3001 3002
```

Esse comando irá gerar um arquivo `.env` semelhante ao seguinte:

```
IP=192.168.x.x
HOST_PORT=3000
HOST_WEBSOCKET_PORT=3001
CLIENT_PORT=3002
```

O script `generate-env.js` já se encarrega de identificar automaticamente o endereço IPv4 da sua máquina, portanto não é necessário configurar isso manualmente.

---

Após a criação do `.env`, os servidores já estarão prontos para serem executados, permitindo a comunicação imediata entre usuários e host pela rede local.

## Uso

Com o ambiente já configurado, utilizar o Help Now é simples.

### 1. Iniciar os servidores HTTP

Para iniciar a aplicação, basta executar o comando:

```bash
npm start
```

ou

```bash
npm run start
```

Ambos funcionam da mesma forma e iniciam os servidores responsáveis por entregar as páginas da aplicação.

### 2. Iniciar o servidor WebSocket

Em seguida, é necessário iniciar o servidor de comunicação em tempo real:

```bash
node websocket.js
```

Esse servidor permite que os pontos da rede se comuniquem instantaneamente por meio do WebSocket, conectando o host aos usuários de forma eficiente.

---

Com esses dois comandos em execução, o Help Now estará funcionando normalmente na rede local, pronto para receber e responder chamados.

## Funcionalidades

O Help Now foi pensado para ser simples, mas sem abrir mão de recursos úteis para monitoramento e controle. Abaixo estão algumas das funcionalidades implementadas por padrão:

### Log de requisições HTTP por IP

Todos os acessos aos servidores são registrados com o endereço IP de origem. Isso permite identificar facilmente quem está acessando o quê dentro da rede local.

**Exemplo de saída no terminal:**

```
Request for: /images/call-center.png from IP: xxx.xxx.xxx.xx
Request for: / from IP: xxx.xxx.xxx.xx
Request for: /css/style-host.css from IP: xxx.xxx.xxx.xx
Request for: /js/scripts/script-host.js from IP: xxx.xxx.xxx.xx
```

Esses logs são úteis tanto para diagnóstico quanto para auditoria interna.

### Log detalhado de conexões WebSocket

O servidor WebSocket também fornece logs completos sobre as conexões estabelecidas e as mensagens trocadas entre usuários e host. Isso inclui identificação de clientes, sessões, mensagens recebidas e eventos de desconexão.

**Exemplo de log de WebSocket:**

```
Cliente conectado
[RECEBIDO] Mensagem:  {
  type: 'init',
  id: 'd572d744-8f2c-45c2-b376-44875d6de469',
  session: '8c3ea7f4cc96158e37ccc1aae1d82c5df64b913fc7a1370c0a88321753eac5c4'
}
[INFO] Cliente identificado como d572d744-8f2c-45c2-b376-44875d6de469
[INFO] Sessão: 8c3ea7f4cc96158e37ccc1aae1d82c5df64b913fc7a1370c0a88321753eac5c4

Cliente conectado
[RECEBIDO] Mensagem:  {
  type: 'init',
  id: 'host-03677318-85af-4fea-9048-f754141664d4',
  host: true
}
[INFO] Host identificado como host-03677318-85af-4fea-9048-f754141664d4
[INFO] Sessão: no-session-id

[DESCONECTADO] Host host-03677318-85af-4fea-9048-f754141664d4 foi removido da lista
```

Essas informações facilitam o rastreamento das sessões e o controle dos pontos ativos na rede.
