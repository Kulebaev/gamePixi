let Application = PIXI.Application,
    Container = PIXI.Container,
    loader = PIXI.loader,
    resources = PIXI.loader.resources,
    Graphics = PIXI.Graphics,
    TextureCache = PIXI.utils.TextureCache,
    Sprite = PIXI.Sprite,
    Text = PIXI.Text,
    TextStyle = PIXI.TextStyle;

let app = new Application({
    width: window.innerWidth,
    height: window.innerHeight,
    antialias: true,
    autoResize: true,
    resolution: window.devicePixelRatio || 1
});

document.body.appendChild(app.view);

window.addEventListener('resize', () => {
    app.renderer.resize(window.innerWidth, window.innerHeight);
});

let state, scoreBar, value = 0, score, target, gameScene,
    id, bg, timer = 10, targetClick = true;

// Load saved score
if (localStorage.getItem('score')) {
    value = parseInt(localStorage.getItem('score'));
}

loader
    .add("images/atlas.json")
    .load(setup);

function setup() {
    id = resources["images/atlas.json"].textures;

    gameScene = new Container();
    app.stage.addChild(gameScene);

    bg = new Sprite(id["background.png"]);
    bg.anchor.set(0, 0);
    bg.width = app.screen.width;
    bg.height = app.screen.height;
    gameScene.addChild(bg);

    scoreBar = new Container();
    scoreBar.position.set(app.stage.width / 2 - scoreBar.width / 2, 22);
    gameScene.addChild(scoreBar);

    let bgScoreBar = new Sprite(id["score.png"]);
    scoreBar.addChild(bgScoreBar);

    let style = new TextStyle({
        fontFamily: "Arial",
        fontSize: 28,
        fill: "white",
    });

    score = new Text(value.toString(), style);
    score.x = -score.width / 2;
    score.y = -score.height / 2 - 1;
    scoreBar.addChild(score);

    target = new Sprite(id["cookie.png"]);
    target.x = gameScene.width / 2;
    target.y = gameScene.height / 2;
    target.interactive = true;
    target.buttonMode = true;
    target.on("pointerdown", handlerClick);
    gameScene.addChild(target);

    state = play;
    app.ticker.add(delta => gameLoop(delta));
}

function gameLoop(delta) {
    state(delta);
}

function play() {
    if (timer == 0) {
        targetClick = true;
        target.scale.x = 1;
        target.scale.y = 1;
    } else if (timer > 0) {
        timer--;
    }
}

function handlerClick() {
    if (targetClick) {
        value++;
        score.text = value;

        score.x = -score.width / 2;
        score.y = -score.height / 2;

        target.scale.x = 0.95;
        target.scale.y = 0.95;

        targetClick = false;

        timer = 10;

        // Save the score
        localStorage.setItem('score', value);
    }
}

window.addEventListener('resize', () => {
    app.renderer.resize(window.innerWidth, window.innerHeight);
    bg.width = app.screen.width;
    bg.height = app.screen.height;
    target.x = app.screen.width / 2;
    target.y = app.screen.height / 2;
});
