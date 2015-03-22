/*global define*/

define([
    'lodash',
    'physicsjs',
    'physicsjs/renderers/canvas',
    'physicsjs/behaviors/edge-collision-detection',
    'physicsjs/behaviors/body-impulse-response',
    'physicsjs/behaviors/body-collision-detection',
    'physicsjs/behaviors/sweep-prune',
    'physicsjs/bodies/rectangle',
    'physicsjs/bodies/circle'
], function (_, physics) {

    var environment,

        bounds = physics.aabb(0, 0, 1050, 800),

        renderer = physics.renderer('canvas', {
            el: 'viewport',
            width: 1050,
            height: 800,
            autoResize: false
        }),

        borderTop = physics.body('rectangle', {
            label: 'borderTop',
            x: 1,
            y: 0,
            width: 1048,
            height: 1,
            mass: 9999
        }),

        borderBottom = physics.body('rectangle', {
            label: 'borderBottom',
            x: 2,
            y: 800,
            width: 1048,
            height: 1,
            mass: 9999
        }),

        goalPlayerOne = physics.body('rectangle', {
            label: 'goalPlayerOne',
            x: 0,
            y: 0,
            width: 1,
            height: 800,
            mass: 9999
        }),

        goalPlayerTwo = physics.body('rectangle', {
            label: 'goalPlayerTwo',
            x: 1050,
            y: 0,
            width: 1,
            height: 800,
            mass: 9999
        }),

        playerOne = physics.body('rectangle', {
            label: 'playerOne',
            x: 10,
            y: 400,
            width: 10,
            height: 100,
            mass: 9999
        }),

        playerTwo = physics.body('rectangle', {
            label: 'playerTwo',
            x: 1040,
            y: 400,
            width: 10,
            height: 100,
            mass: 9999
        }),

        ball = physics.body('circle', {
            label: 'ball',
            x: 525,
            y: 400,
            radius: 20,
            vx: 1,
            vy: 1,
            mass: 2
        });

    // Bootstrap collision detection on objects, will be defined on each object
    physics.body.mixin('onBallHit', function (ball){
        return ball;
    });

    physics(function (world) {
        environment = world;

        world.add(renderer);

        // Borders
        world.add(borderTop);
        world.add(borderBottom);

        // Goals
        world.add(goalPlayerOne);
        world.add(goalPlayerTwo);

        // Controls
        world.add(playerOne);
        world.add(playerTwo);
        world.add(ball);


        world.add(physics.behavior('edge-collision-detection', {
            aabb: bounds
        }));

        world.add(physics.behavior('body-impulse-response'));
        world.add(physics.behavior('body-collision-detection') );
        world.add(physics.behavior('sweep-prune'));

        physics.util.ticker.on(function (time) {
           world.step(time);
        });

        world.on('step', function () {
            world.render();
        });

        // If extending a body and you want to handle its collision
        world.on('collisions:detected', function( data ){
            _.forEach(data.collisions, function (collision) {
                // only events that includes a ball are interesting
                if (collision.bodyA.label !== 'ball' && collision.bodyB.label !== 'ball') {
                    return;
                }

                if (collision.bodyA.label === 'ball') {

                    collision.bodyB.onBallHit(collision.bodyA);
                } else {
                    collision.bodyA.onBallHit(collision.bodyB);
                }
            });
        });
    });

    return {
        'env': environment,
        'players': {
            'one': playerOne,
            'two': playerTwo
        },
        'borders': {
            'top': borderTop,
            'bottom': borderBottom
        },
        'goals': {
            'playerOne': goalPlayerOne,
            'playerTwo': goalPlayerTwo
        },
        'ball': ball
    };
});