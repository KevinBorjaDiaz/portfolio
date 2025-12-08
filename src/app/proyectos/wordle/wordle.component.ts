import { Component, ElementRef, ViewChild } from '@angular/core';
import { fiveLetterWords_EN, sevenLetterWords_EN, fiveLetterWords_ES, sevenLetterWords_ES, } from './words';

type KeyStatus = 'correct' | 'present' | 'absent' | '';

interface Cell {
  letter: string;
  status: KeyStatus;
}

type AlphabetMap = Record<string , KeyStatus>;

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
  alphabetMap: AlphabetMap = {};
  
  guesses: Cell[][] = [];
  currentGuess: number = 0;
  currentColumn: number = 0;
  maxGuesses: number = 6;
  buttonSize: number = 30;
  
  targetWord: string = '';
  errorMessage: string = '';
  buttonEnterText: string = 'ENTER';
  
  language: string = localStorage.getItem('wordleLanguage') || 'EN';
  wordLength: number = parseInt(localStorage.getItem('wordleWordLength')) ||  5;

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

  resetAlphabetMap(): void {
    Object.keys(this.alphabetMap).forEach(x => { this.alphabetMap[x] = '';});
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
    
    this.manageGuessClasses(guess, currentWord, targetLetters);

    return false;
  }

  manageGuessClasses(guess: string, currentWord: Cell[], targetLetters: string[]): void {
    for (let i = 0; i < this.wordLength; i++) {
      // Validate letter in alphabet
      if (!(guess[i] in this.alphabetMap)) {
        this.alphabetMap[guess[i]] = '';
      }

      if (guess[i] === this.targetWord[i]) {
        currentWord[i].status = 'correct';
        targetLetters[i] = '';

        this.alphabetMap[guess[i]] = 'correct';
      } 
    }

    for (let i = 0; i < this.wordLength; i++) {
      if (targetLetters.includes(guess[i]) && currentWord[i].status !== 'correct') {
        currentWord[i].status = 'present';
        targetLetters[targetLetters.indexOf(guess[i])] = '';
        
        if (this.alphabetMap[guess[i]] !== 'correct') {
          this.alphabetMap[guess[i]] = 'present';
        }
      }
      else if (currentWord[i].status !== 'correct'){
        currentWord[i].status = 'absent';
        if (this.alphabetMap[guess[i]] !== 'correct' && this.alphabetMap[guess[i]] !== 'present') {
          this.alphabetMap[guess[i]] = 'absent';
        }
      }
    }
  }

  resetGame(): void {
    this.guesses = [];
    this.currentGuess = 0;
    this.currentColumn = 0;
    this.initializeGuesses();
    this.resetAlphabetMap();
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
    console.log(this.targetWord)
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
    localStorage.setItem('wordleLanguage', this.language);
    this.resetGame();
  }

  onLengthChange(event: any): void {
    const selectedLength = parseInt(event.target.value);
    this.wordLength = selectedLength;
    localStorage.setItem('wordleWordLength', this.wordLength.toString());
    this.resetGame();
  }
}
