## Tic Tac Toe - OOP (100Devs Project Class 29 - 32)

This is a project assignment from 100Devs focusing on utilizing OOP practices.  

You can customize your name, tile piece, and color to your liking. It accepts cases where you can put the same tilePiece, assuming each player uses a different color. 

[Demo ❌⭕](https://jordles.github.io/tic-tac-toe/)

## Key Topics
OOP Pillars (EAIP or PAIN) Checklist:  

1. E(N)capsulation -  TicTacToe class groups our properties and methods for easier management of data.  

2. Abstraction -  Various properties and methods are private, to ensure players cannot cheat or manipulate the game in anyway. Some examples includes the player class which users are not allowed to alter programmatically, but only through interacting with the UI given, and important properties like setting who is the current player or the board size or the winner of the game are also private. It is also used to hide unnecessary information and expose only the necessary information.

3. Inheritance - The TicTacToe class inherits from the Game class.   

4. Polymorphism - Since we don't know how a certain game will run, Game class' methods are left empty, we will override them in its child classes.

---

Possible Features to Implement:  
*  A line across the 3 tile pieces to indicate the match and end of the game.   
* Greyed out player buttons to indicate they cannot be changed until the game ends.  
* Adding an AI options to play against a bot instead.  

Known issues: 
emojis/symbols can go past the 1 character limit for tilePieces. I have tried to use an input event listener instead but that doesn't work, including cases with copy and paste.  
