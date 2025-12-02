import { Component, ElementRef, ViewChild } from '@angular/core';
import { fiveLetterWords_EN, sevenLetterWords_EN, fiveLetterWords_ES, sevenLetterWords_ES, } from './words';

interface Cell {
  letter: string;
  status: 'correct' | 'present' | 'absent' | '';
}

@Component({
  selector: 'app-wordle',
  standalone: false,
  templateUrl: './wordle.component.html',
  styleUrl: './wordle.component.css'
})


export class WordleComponent {
  lettersRow1: string[] = ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'];
  lettersRow2: string[] = ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L']
  lettersRow3: string[] = ['Z', 'X', 'C', 'V', 'B', 'N', 'M'];
  wordLength: number = 5;
  
  guesses: Cell[][] = [];
  currentGuess: number = 0;
  currentColumn: number = 0;
  maxGuesses: number = 6;
  buttonSize: number = 30;

  targetWord: string = '';
  errorMessage: string = '';
  buttonEnterText: string = 'ENTER';

  language: string = 'EN';

  constructor() {
    this.initializeGuesses();
  }

  ngOnInit() {
    this.updateButtonText();
    window.addEventListener('resize', this.updateButtonText.bind(this));
  }

  ngAfterViewInit() {
    window.addEventListener('keydown', (event) => this.onKeyDown(event));
  }

  initializeGuesses(): void {
    for (let i = 0; i < this.maxGuesses; i++) {
      const row: Cell[] = [];
      for (let j = 0; j < this.wordLength; j++) {
        row.push({ letter: '', status: '' });
      }
      this.guesses.push(row);
    }

    this.getRandomWord();
  }

  onLetterClick(letter: string): void {
    if (this.currentColumn >= this.wordLength) {
      return;
    }

    this.guesses[this.currentGuess][this.currentColumn].letter = letter;
    this.currentColumn++;
  }

  onDeleteClick(): void {
    if (this.currentColumn <= 0) {
      return;
    }

    this.currentColumn--;
    this.guesses[this.currentGuess][this.currentColumn].letter = '';
  }

  onEnterClick(): void {
    if (this.currentColumn !== this.wordLength) {
      this.errorMessage = 'Not enough letters';
      return;
    }
    
    const isCorrect = this.checkGuess();
    
    if (isCorrect){
      alert(`Congratss!! you found the word ${this.targetWord}`);
      this.resetGame();
      return;
    }

    if (this.errorMessage) {
      return;
    }
    
    this.currentGuess++;
    this.currentColumn = 0;

    if (this.currentGuess >= this.maxGuesses) {
      alert(`Game Over! The word was: ${this.targetWord}`);
      this.resetGame();
    }
  }

  checkGuess(): boolean {
    const currentWord = this.guesses[this.currentGuess];
    
        const guess = currentWord
    .map(cell => cell.letter)
    .join('');
    
    const isValid = this.validateWord(guess);
    
    if (!isValid) {
      this.errorMessage = 'Word not in dictionary';
      return false;
    }
    
    this.errorMessage = '';
    
    if (guess == this.targetWord) {
      return true;
    }
    
    const targetLetters = this.targetWord.split('');
    
    for (let i = 0; i < this.wordLength; i++) {
      currentWord[i].status = 'absent';
      if (guess[i] === this.targetWord[i]) {
        currentWord[i].status = 'correct';
        targetLetters[i] = '';
      } 
    }
    
    for (let i = 0; i < this.wordLength; i++) {
      if (targetLetters.includes(guess[i])) {
        currentWord[i].status = 'present';
        targetLetters[targetLetters.indexOf(guess[i])] = '';
      }
    }

    return false;
  }

  resetGame(): void {
    this.guesses = [];
    this.currentGuess = 0;
    this.currentColumn = 0;
    this.initializeGuesses();
  }

  updateButtonText() {
    this.buttonEnterText = window.innerWidth < 820 ? '↵' : 'ENTER';
  }

  getWordList(): string[] {
    if (this.language === 'EN') {
      return this.wordLength === 5 ? fiveLetterWords_EN : sevenLetterWords_EN;
    }

    if (this.language === 'ES') {
      return this.wordLength === 5 ? fiveLetterWords_ES : sevenLetterWords_ES;
    }
  }

  validateWord(guess: string): boolean {
    const wordList = this.getWordList();
    return wordList.map(word => word.toUpperCase()).includes(guess.toUpperCase());
  }

  getRandomWord(): void {
    const wordList = this.getWordList();
    this.targetWord = wordList[Math.floor(Math.random() * wordList.length)].toUpperCase();
  }

  onKeyDown(event: KeyboardEvent): void {
    const key = event.key.toUpperCase();
    if (key === 'ENTER') {
      this.onEnterClick();
      return;
    }

    if (key === 'BACKSPACE') {
      this.onDeleteClick();
      return;
    }

    // Only allow single letters from the keyboard
    const regex = /^[a-zA-Z]$/;
    if (regex.test(key)) {
      if (this.lettersRow1.includes(key) || this.lettersRow2.includes(key) || this.lettersRow3.includes(key)) {
        this.onLetterClick(key);
      }
    }
  }

  onLanguageChange(event: any): void {
    const selectedLanguage = event.target.value;
    this.language = selectedLanguage;
    this.resetGame();
  }

  onLengthChange(event: any): void {
    const selectedLength = parseInt(event.target.value);
    this.wordLength = selectedLength;
    this.resetGame();
  }
}
