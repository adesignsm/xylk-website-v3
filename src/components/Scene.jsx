//Reference:
//Matter.js Docs: 
//https://brm.io/matter-js/docs/classes/Engine.html#methods
//https://github.com/liabru/matter-js/wiki/Getting-started
//Extra Docs:
//https://paulie.dev/posts/2020/08/react-hooks-and-matter-js/
//https://codesandbox.io/s/76c81?file=/src/Scene.js:230-434

import React, { useEffect, useRef, useState } from "react";
import Matter, { Engine, Render, Runner, World, Body, Bodies, Events } from "matter-js";
import Products from "./Product";

const Scene = ({ productData }) => {
    let bodies = [];
    let body;
    let bodiesDom;

    const VIEW = {};
    VIEW.width    = window.innerWidth;
    VIEW.height   = window.innerHeight;
    VIEW.centerX  = VIEW.width / 2;
    VIEW.centerY  = VIEW.height / 2;
    VIEW.offsetX  = VIEW.width / 2;
    VIEW.offsetY  = VIEW.height / 2;

    let matterWidth = window.innerWidth, matterHeight = window.innerHeight - 70;

    const boxRef = useRef(null);
    const canvasRef = useRef(null);

    const init = () => {
        const engine = Engine.create({
            enableSleeping: false,
            positionIterations: 20,
            gravity: {
                x: 0,
                y: 0,
                scale: 0
            }
        }), world = engine.world;

        //CREATE A 'RENDERER'
        const render = Render.create({
            element: boxRef.current,
            engine: engine,
            canvas: canvasRef.current,
            options: {
                width: matterWidth,
                height: matterHeight,
                background: "transparent",
                wireframes: false,
            }
        });

        //CREATE A 'RUNNER'
        var runner = Runner.create();

        //CREATING BODIES
        bodiesDom = document.getElementsByClassName('bags');

        for (var i = 0; i < bodiesDom.length; i++) {
            if (bodiesDom[i]) {
                body = Bodies.circle( VIEW.centerX + Math.floor(Math.random() * VIEW.width/2) - VIEW.width/4, VIEW.centerY + Math.floor(Math.random() * VIEW.height/2) - VIEW.height/4, 30, {
                    label: "ball",
                    restitution: 1,
                    isStatic: false,
                    friction: 0,
                    frictionAir: 0,
                    density: 0.1,
                    inertia: Infinity,
                    render: {
                        fillStyle: "transparent",
                        sprite: {
                            texture: bodiesDom[i].firstChild.src,
                            xScale: 0.8,
                            yScale: 0.8,
                        }
                    },
                    url: productData[i].custom_url.url,
                })
            }
            
            bodies.push(body);

            setInterval(() => {
                for (let x = 0; x < bodies.length; x++) {
                    Body.applyForce(bodies[x], 
                        { x: 0, y: 0 }, 
                        { 
                            x: Math.floor(Math.random() * (0.08 - -0.008 + 1) + -0.008), 
                            y: Math.floor(Math.random() * (0.08 - -0.008 + 1) + -0.008)
                        }
                    );
                }
            }, 500)
        }

        const WALLWIDTH = 20;
        const wallOptions = {
            restitution: -100,
            isStatic: true,
            density: 1,
            render: {
                fillStyle: "transparent"
            }
        }

        //Adding Walls
        World.add(engine.world, [
            //top
            Bodies.rectangle(0, 0, matterWidth * 2, WALLWIDTH, {
                ...wallOptions,
                label: "wall_top"
            }),
            //Bottom
            Bodies.rectangle(0, matterHeight, matterWidth * 2, WALLWIDTH, {
                ...wallOptions,
                label: "wall_bottom"
            }),
            // Left
            Bodies.rectangle(0, matterHeight - 200, WALLWIDTH, matterWidth * 2, {
                ...wallOptions,
                label: "wall_left"
            }),
            // Right
            Bodies.rectangle(matterWidth, 200, WALLWIDTH, matterWidth * 2, {
                ...wallOptions,
                label: "wall_right"
            })
        ]);

        render.mouse = Matter.Mouse.create(render.canvas);
        var mouseInteractivity = Matter.MouseConstraint.create(engine, {
            mouse: render.mouse,
            constraint: {
                stiffness: 1,
                render: { visible: false }
            }
        });

        Matter.World.add(engine.world, mouseInteractivity);

        Events.on(mouseInteractivity, 'mousedown', function(event) {
            var mouseConstraint = event.source;
            var bodies = engine.world.bodies;
            if (!mouseConstraint.bodyB) {
                for (i = 0; i < bodies.length; i++) { 
                    var body = bodies[i];
                    if (Matter.Bounds.contains(body.bounds, mouseConstraint.mouse.position)) {
                        var bodyUrl = "https://grocerybags.mybigcommerce.com" + body.url;
                        // Hyperlinking feature
                        if (bodyUrl != undefined) {
                            window.open(bodyUrl, '_self');
                            console.log("Hyperlink was opened");
                        }
                        break;
                    }
                }
            }
        });

        //Adding the ball
        World.add(world, bodies);

        //Events.on(mouseInteractivity, "mouseup", handleCollision);
        Runner.run(runner, engine);
        Render.run(render);

    };

    useEffect(() => {
        setTimeout(() => {
            init();
        }, 100)
    })

    return (
        <>
            <div ref={boxRef} style={{ width: "100vw", height: "100vh" }}>
                <canvas ref={canvasRef} />
                <Products productData={productData} />
                <button id="stop-button" onClick={(e) => {
                    bodies.forEach((b) => {
                        if ((!b.isStatic)) {
                            b.isStatic = true;    
                        } else {
                            b.isStatic = false;     
                        }

                        if (b.isStatic) {
                            e.target.innerHTML = "Nevermind I like the bounce";
                        } else if (!b.isStatic) {
                            e.target.innerHTML = "I give up, hold still!";
                        }
                    })
                }}> I give up, hold still! </button>
            </div>
        </>
    )
}

export default Scene;