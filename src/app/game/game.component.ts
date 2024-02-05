import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MyDialogComponent } from '../my-dialog/my-dialog.component';

enum Player {
  None = '',
  X = 'X',
  O = 'O',
}
@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule, MyDialogComponent],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss',
})
export class GameComponent {
  cells: Player[] = new Array(9).fill(Player.None);
  currentPlayer: Player = Player.X;
  winner: Player | null = null;
  gameOver: boolean = false;

  constructor(private dialog: MatDialog) {}

  makeMove(index: number): void {
    if (!this.cells[index] && !this.gameOver) {
      this.cells[index] = this.currentPlayer;
      this.checkWinner();
      this.currentPlayer =
        this.currentPlayer === Player.X ? Player.O : Player.X;

      // Check for draw after updating the current player
      if (!this.cells.includes(Player.None) && !this.winner) {
        this.gameOver = true;
        this.showDialog("It's a draw!🤜🤛");
      }
    }

    if (this.winner) {
      this.showDialog(`Player ${this.winner} is the winner!🎉`);
    }
  }
  checkWinner(): void {
    const winnerPositions: number[][] = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (const [a, b, c] of winnerPositions) {
      if (
        this.cells[a] != Player.None &&
        this.cells[a] === this.cells[b] &&
        this.cells[a] === this.cells[c]
      ) {
        this.winner = this.cells[a];
        this.gameOver = true;
        break;
      }
    }
  }
  showDialog(message: string): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = { message };

    this.dialog.open(MyDialogComponent, dialogConfig);
  }

  reset(): void {
    this.cells.fill(Player.None);
    this.currentPlayer = Player.X;
    this.winner = null;
    this.gameOver = false;
  }
}
