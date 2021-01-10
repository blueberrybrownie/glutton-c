"use strict";


// Variables

var i = 0;
var jump = 0;
var foodSpawn = 0;
var fruitSpawn = randomIntFromInterval(130, 20); // Range from max - min, max/min aren't included;
var enemySpawn = 30;
var powerupSpawn = randomIntFromInterval(180, 60);
var invincible = 0;
var timeLeft = 5;
var playerPos = 0; // Position of player in grid
var started = 0;
var score = 0;
var runGame;
var powerupTime;

var startAudio = new Audio('https://gluttonc.chesterdoran.com/start.wav');
var deathAudio = new Audio('https://gluttonc.chesterdoran.com/death.wav');

var button = document.querySelector("#gluttonc-button");


// Arrays

var grid = []; // Playable area
var food = [];
var fruit = [];
var enemy = [];
var powerup = [];


// Random number generator from range

function randomIntFromInterval(min, max) {
 return Math.floor(Math.random() * (max - min + 1) + min);
}


// Countdown for invincibility

function powerupTimer() {

  if (timeLeft <= 1) {
    clearInterval(powerupTime);
    invincible = 0;
    timeLeft = 6;
  }
  --timeLeft;
}


function playerJump() {
  
  // Animate 3 stages of jump, last 2 are for jump cooldown, prevent player from constantly jumping

  switch (jump) {
    case 5:
      grid[playerPos]=' '+String.fromCharCode(0x200D)+' '+"^"; // 1st sprite
      break;

    case 4:
      grid[playerPos]=' '+String.fromCharCode(0x200D)+' '+"ˆ"; // 2nd sprite
      break;

    case 3:
      grid[playerPos]=' '+String.fromCharCode(0x200D)+' '+"^"; // 3rd sprite
      break;

    default:
      grid[playerPos]=' '+String.fromCharCode(0x200D)+' '+"c"; // Normal sprite
  }
  
}



// Game engine

function gameLogic() {

  
	// If game is in progress
  
	if (started == 1) {
    
		for (i = 0; i < 55; i++) { // Create grid, fill with blank characters

			grid[i]=String.fromCharCode(0x200D)+' '+String.fromCharCode(0x200D)+' '; 
      
      /* Originally used a blank braille character as a space, but as of Firefox 78 and Chrome 85, blank braille characters are encoded :( Unlike Chrome, Firefox doesn't encode spaces in it's urlbar - only consecutive spaces get encoded. Inserting Zero Width Joiners (normally used to join two or more characters together in sequence to create a new emoji) between spaces gets around this limitation, but will likely break in the future. */
      
		}
    
    
    // Render character
	
    // If player is invincible
    
    if (invincible == 1) {
      grid[playerPos]=' '+String.fromCharCode(0x200D)+' '+timeLeft+String.fromCharCode(0x2602); // Invincibility sprite
    }
    
    
    // If player is jumping
    
		else if (jump > 0) {
			--jump; // Decrease counter
      playerJump(); // Jump animation
    
		} 
    
    
		// Else, render normal character
    
		else {
		  grid[playerPos]=' '+String.fromCharCode(0x200D)+' '+"c";
		}
    
    
  
    // Spawn food
    
    if (foodSpawn > 0) { // Wait until spawning
			--foodSpawn;
		} 
    
    else if (!(enemy.includes(55))) { // Don't create food next to enemy
      i = 0;
      while (food[i] > 0) {
        i++;
      }
      
      food[i] = 55; // Place new food at end of grid
      foodSpawn = 1; // Countdown until new food
    }
    
    
    // Move food
    
    for (i = 0; i < food.length; i++) {
		
			--food[i]; // Move current food forward
      
      // If food is still on screen
			if (food[i] >= 0) {
        
				if (food[i] == playerPos) { // If food hits player
          
          // If player is invincible
					if (invincible == 1) {
            grid[food[i]]=' '+String.fromCharCode(0x200D)+' '+timeLeft+String.fromCharCode(0x2602); // Render character as invincibility sprite
            food[i] = 0; // Remove food
            ++score; // Increase score
					}
          
          // If player is jumping
					else if (jump > 2) {
            playerJump(); // Jump animation
            food[i] = 0; // Remove food
					}

          // Else player eats food
          else {
            grid[food[i]]=' '+String.fromCharCode(0x200D)+' '+"o"; // Change character sprite to mouth closed
            food[i] = 0; // Remove food
            ++score; // Increase score
          }       

				}
        
        // Else, render food
				else {
					grid[food[i]]=String.fromCharCode(0x200D)+String.fromCharCode(0x00B7)+String.fromCharCode(0x200D);
				}
        
			}
      
		}
        
    
    
    // Spawn fruit
    
    if (fruitSpawn > 0) { // Wait until spawning
			--fruitSpawn;
		} 
    
    else if (!(food.includes(53)) && !(enemy.includes(54))) { // Don't create fruit next to or on top of anything
      i = 0;
      while (fruit[i] > 0) {
        i++;
      }
      
      fruit[i] = 55; // Place new fruit at end of grid
      fruitSpawn = randomIntFromInterval(170, 50); // Countdown until new food
    }
    
    
    // Move fruit
    
    for (i = 0; i < fruit.length; i++) {
		
			--fruit[i]; // Move current fruit forward
      
      // If fruit is still on screen
			if (fruit[i] >= 0) {
        
				if (fruit[i] == playerPos) { // If fruit hits player
          
          // If player is invincible
					if (invincible == 1) {
            grid[fruit[i]]=' '+String.fromCharCode(0x200D)+' '+timeLeft+String.fromCharCode(0x2602); // Render character as invincibility sprite
            fruit[i] = 0; // Remove fruit
            score += 5; // Increase score
					}
          
          // If player is jumping
					else if (jump > 2) {
            playerJump(); // Jump animation
            fruit[i] = 0; // Remove fruit
					}

          // Else player eats fruit
          else {
            grid[food[i]]=' '+String.fromCharCode(0x200D)+' '+"o"; // Change character sprite to mouth closed
            fruit[i] = 0; // Remove fruit
            score += 5; // Increase score
          }       

				}
        
        // Else, render fruit
				else {
					grid[fruit[i]]=String.fromCharCode(0x25AB);
				}
        
			}
      
		}
    

    
    // Spawn enemy
    
    if (enemySpawn > 0) { // Wait until spawning
			--enemySpawn;
		} 
    
    else if (!(food.includes(53))) { // Don't create enemy next to food
      i = 0;
      while (enemy[i] > 0) {
        i++;
      }
      
      enemy[i] = 55; // Place new enemy at end of grid
      
      // Countdown until new enemy, increases difficulty
      if (score < 50) {
        enemySpawn = randomIntFromInterval(26, 6); // Range from max - min, max/min aren't included        
      }
      
      else if (score < 180) {
        enemySpawn = randomIntFromInterval(20, 4);
      }
      
      else if (score < 280) {
        enemySpawn = randomIntFromInterval(13, 4);
      }
      
      else {
        enemySpawn = randomIntFromInterval(8, 4);
      }
      
    }

		
		// Move enemy
    
		for (i = 0; i < enemy.length; i++) {
		
			--enemy[i]; // Move current enemy forward
			
			// If enemy is still on screen
			if (enemy[i] >= 0) {
			
				if (enemy[i] == playerPos) { // If enemy hits player
          
          // If player is invincible
          if (invincible == 1) {
            grid[enemy[i]]=' '+String.fromCharCode(0x200D)+' '+timeLeft+String.fromCharCode(0x2602); // Render character as invincibility sprite
            enemy[i] = 0; // Remove enemy
            --score; // Enemies spawn on food, so minus 1 from score to compensate
          }
          
          // If player is jumping
          else if (jump > 2) {
						playerJump(); // Jump animation
            enemy[i] = 0; // Remove enemy
					}

          // Else player gets hit
          else {
            // Change character to dead sprite
            grid[enemy[i]]=' '+String.fromCharCode(0x200D)+' '+String.fromCharCode(0x200D)+' '+String.fromCharCode(0x200D)+' '+String.fromCharCode(0x0489)+' '+String.fromCharCode(0x200D)+' ';
            enemy[i] = 0; // Remove enemy
            --score; // Enemies spawn on food, so minus 1 from score to compensate
            started = 0; // End game
          }
          
				}
        
				// Else, render enemy
				else {
					grid[enemy[i]]=String.fromCharCode(0x2603);
				}
        
			}
      
		}
    
    
    // Spawn powerup
    
    if (powerupSpawn > 0) { // Wait until spawning
			--powerupSpawn;
		} 
    
    else if (!(food.includes(53)) && !(enemy.includes(54))) { // Don't spawn powerup next to or on top of anything
      i = 0;
      while (powerup[i] > 0) {
        i++;
      }
      
      powerup[i] = 55; // Place new powerup at end of grid
      // Countdown until new powerup
      powerupSpawn = randomIntFromInterval(400, 100); // Range from max - min, max/min aren't included
    }
    
    
    // Move powerup
    
    for (i = 0; i < powerup.length; i++) {
		
			--powerup[i]; // Move current powerup forward
      
      // If powerup is still on screen
			if (powerup[i] >= 0) {
        
			  // If powerup hits player
				if (powerup[i] == playerPos) {
          
					if (jump > 2) { // If player is jumping
						playerJump(); // Jump animation
            powerup[i] = 0; // Remove powerup
					}

          // Player gets powerup
          
          else {
            powerupTime = setInterval(powerupTimer, 1000); // Set timer
            
            grid[powerup[i]]=' '+String.fromCharCode(0x200D)+' '+timeLeft+String.fromCharCode(0x2602); // Change character sprite to powerup + time left
            powerup[i] = 0; // Remove powerup
            invincible = 1; // Set invincibility
          }

				}
        
        // Else, render powerup
				else {
					grid[powerup[i]]=String.fromCharCode(0x2602);
				}
        
			}
      
		}
    
    
		// Render game in address bar
		history.replaceState(null, '', "#"+grid.join('')+String.fromCharCode(0x200D)); // '#' prevents page reload
    
	}
  
  
	// Game has ended
  
	else {
    
		clearInterval(runGame); // Stop game interval
    
    // Check if sound is on / button can't be found and play tune

    try {
      if (button.innerHTML == "Sound: On") {
        deathAudio.play();
      }
    }
    catch(e) { // Button is not found, assume sound is on
      deathAudio.play();
    }
    
    
    // Reset game

    grid = [];
    food = [];
    fruit = [];
    enemy = [];
    powerup = [];
    jump = 0;
    foodSpawn = 0;
    fruitSpawn = randomIntFromInterval(150, 80);
    enemySpawn = 30;
    powerupSpawn = randomIntFromInterval(250, 60);
    
    
    // Save high score
    
    if ((button !== null) && (localStorage.getItem("highScore") < score)) {
      localStorage.setItem("highScore", score);
    }
    
    
    // Add game over message and print score
    setTimeout(function () {
      history.replaceState(null, '', "#"+' '+String.fromCharCode(0x200D)+' '+String.fromCharCode(0x200D)+' '+String.fromCharCode(0x200D)+' '+
                       String.fromCharCode(0x0489)+' '+String.fromCharCode(0x200D)+' '+String.fromCharCode(0x200D)+
                       ' '+String.fromCharCode(0x200D)+' '+"GAME"+
                       ' '+String.fromCharCode(0x200D)+' '+"OVER!"+
                       ' '+String.fromCharCode(0x200D)+' '+"Score:"+
                       ' '+String.fromCharCode(0x200D)+' '+score
      );
      if (button !== null) {
        displayScore();
      }
    }, 200);

    // Press any key to restart after 1 second
    setTimeout(function () {
      history.replaceState(null, '', "#"+' '+String.fromCharCode(0x200D)+' '+String.fromCharCode(0x200D)+' '+String.fromCharCode(0x200D)+' '+
                       String.fromCharCode(0x0489)+' '+String.fromCharCode(0x200D)+' '+String.fromCharCode(0x200D)+
                       ' '+String.fromCharCode(0x200D)+' '+"GAME"+
                       ' '+String.fromCharCode(0x200D)+' '+"OVER!"+
                       ' '+String.fromCharCode(0x200D)+' '+"Score:"+
                       ' '+String.fromCharCode(0x200D)+' '+score+
                       ' '+String.fromCharCode(0x200D)+' '+"(Press"+
                       ' '+String.fromCharCode(0x200D)+' '+"any"+
                       ' '+String.fromCharCode(0x200D)+' '+"key"+
                       ' '+String.fromCharCode(0x200D)+' '+"to"+
                       ' '+String.fromCharCode(0x200D)+' '+"restart)");
      
      startGame();
      
    }, 1600);
    
  }
  
}


// Jump when up key pressed

function keyPress() {

  started = 1; // Game has started

  document.onkeydown = function(event) {
    event.preventDefault();
    var key = event.keyCode;
    if (key == 38 && jump === 0) {
      jump = 5; // 3 sprites of jump, 2 for cooldown
    }
  };
	
}


// Start game

function startGame() {
  
  document.onkeydown = function(event) { // Start game on any key press
    
    var key = event.keyCode;
    if (!(key == 224 || key == 91)) { // Stops cmd/alt-tab from activating game
      event.preventDefault();
      keyPress();
      score = 0; // Reset score
      runGame = setInterval(gameLogic, 100);

      // Check if sound is on / button can't be found and play tune
      
      try {
        if (button.innerHTML == "Sound: On") {
          startAudio.play();
        }
      }
      catch(e) { // Button is not found, assume sound is on
        startAudio.play();
      }
      
    }
    
  };
  
}


history.replaceState(null, '', location.pathname.replace(/\b\/$/, '')); // Clean url
history.replaceState(null, '', "#"+' '+String.fromCharCode(0x200D)+' '+"PRESS"+
                 ' '+String.fromCharCode(0x200D)+' '+"ANY"+
                 ' '+String.fromCharCode(0x200D)+' '+"KEY"+
                 ' '+String.fromCharCode(0x200D)+' '+"TO"+
                 ' '+String.fromCharCode(0x200D)+' '+"PLAY");

startGame();


// Toggle sound

if (button !== null) {
  if (localStorage.getItem("soundPref") == "Sound: Off") { // Toggle button based on memory
    button.innerHTML = "Sound: Off";
  } 
}

function toggleSound() {
  
  if (button.innerHTML == "Sound: On") {
    button.innerHTML = "Sound: Off";
    localStorage.setItem("soundPref", button.innerHTML);
  }
  else {
    button.innerHTML = "Sound: On";
    localStorage.setItem("soundPref", button.innerHTML);
  }
}


// Display high score in HTML if one has been set

function displayScore() {
  if (localStorage.getItem("highScore") !== null) {
    document.getElementById("high-score").innerHTML = localStorage.getItem("highScore"); 
  }
}

if (button !== null) {
  displayScore();
}