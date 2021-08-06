(function () {
    let socket,
        lobby,
        top,
        bot,
        board,
        nick,
        level

    function bind() {
        socket.on("connect", () => {
        });
        socket.on("lobby", (data) => {
          board.innerHTML='';
          data.available.forEach((u)=>{
            let b = document.createElement('div');
            b.textContent = 'Start Game with :'+u.nick+' - ['+u.level+']';
            if (u.nick==nick.value) b.classList.toggle('no',true);
            b.addEventListener('click',()=>{
              socket.emit("reqstart", {opponent: u.id })
            });
            board.appendChild(b);
          })
        });


        socket.on("disconnect", () => {
        });

        socket.on("playstart", (d) => {
          lobby.classList.toggle('gone',true);
          startGame(d.lead,
                   (msg)=>{ socket.emit("gamemsg",msg); },
                   (msg)=>{ socket.emit("reqend"); }
                 );
        });

        socket.on("playend", () => {
          lobby.classList.toggle('gone',false);
          endGame();
        });

        socket.on("gamemsg", (msg) => {
          msgGame(msg);
        });

        socket.on("error", () => {
        });

        document.getElementById("enter").addEventListener('click', ()=>{
          socket.emit("enter", {nick: nick.value, level: level.value })
          bot.classList.toggle("no",false);
          top.classList.toggle("no",true);
        });

        document.getElementById("leave").addEventListener('click', ()=>{
          socket.emit("leave", {nick: nick.value, level: level.value })
          top.classList.toggle("no",false);
          bot.classList.toggle("no",true);
        });
    }

    function init() {
        socket = io({ upgrade: false, transports: ["websocket"] });
        lobby =  document.getElementById("lobby");
        top = document.getElementById("top");
        bot = document.getElementById("bot");
        board = document.getElementById("board");
        nick = document.getElementById("nick");
        level = document.getElementById("lev");
        nick.value="user"+(+(new Date())%10000);
        bind();
    }

    window.addEventListener("load", init, false);

})();
