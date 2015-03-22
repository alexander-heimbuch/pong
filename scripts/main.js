require.config({
    baseUrl: './scripts',
    packages: [{
        name: 'physicsjs',
        location: '../bower_components/physicsjs/dist',
        main: 'physicsjs.min'
    }, {
        name: 'lodash',
        location: '../bower_components/lodash',
        main: 'lodash.min'

    }]
});

require(['./world'], function (world) {

    world.goals.playerOne.onBallHit = function (ball) {
        console.log('goal for player two');
    };

    world.goals.playerTwo.onBallHit = function (ball) {
        console.log('goal for player one');
        console.log(ball.mass )
    };

    world.borders.top.onBallHit = function (ball) {
        ball.state.angular.vel = ball.state.angular.vel * -1;
        ball.mass -= 0.1;
    };

    world.borders.bottom.onBallHit = function (ball) {
        ball.state.angular.vel = ball.state.angular.vel * -1;
        ball.mass -= 0.1;
    };

});