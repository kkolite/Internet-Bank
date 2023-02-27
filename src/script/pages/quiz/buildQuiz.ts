import config from '../../data/config';
import { IQuiz } from '../../data/types';
import langs from '../../data/lang/quiz/langs';

let currentLang;

class BuildQuiz {
  async main() {
    const main = document.querySelector('.main-container');
    const quiz = document.querySelector('.header__nav-quiz');
    if (!main || !quiz) return;

    currentLang = config.lang === 'en' ? langs.en : langs.ru;

    quiz.classList.add('header__nav_active');
    main.innerHTML = `<div class="quiz-container">
      <h2 class="quiz__title">${currentLang['quiz__title']}</h2>
      <div class="quiz__game">
      <p class="quiz__about">${currentLang['quiz__about']}</p>
      <button class="quiz__game_button-start">${currentLang['quiz__game_button-start']}</button>
      </div>
    </div>`;
    const questions = await this.getQuestions();
    const start = document.querySelector('.quiz__game_button-start');
    start?.addEventListener('click', () => this.game(questions));
  }

  async getQuestions() {
    const data = await (await fetch(`${config.server}/quiz`)).json();
    const questions = await data.questions;
    return questions;
  }

  async game(questions: IQuiz[], i = 0, score = 0) {
    const game = document.querySelector('.quiz__game');

    if (!game || !questions) return;

    sessionStorage.setItem('quiz', JSON.stringify(questions[i]));

    const isEnglish = config.lang === 'en';
    currentLang = config.lang === 'en' ? langs.en : langs.ru;

    game.innerHTML = `<h3 class="quiz__question_num"><span class="quiz__question_num-q">${
      currentLang['quiz__question_num-q']
    }</span> <span class="quiz__question_num-n">${i + 1}</span><h3>
    <h4 class="quiz__score"><span class="quiz__score_s">${
      currentLang['quiz__score_s']
    }</span> <span class="quiz__score_n">${score}</span></h4>
    <p class="quiz__question"></p>
    <ul class="quiz__answers"></ul>
    <p class="quiz__description"></p>
    <p class="quiz__result"><p>
    <button class="quiz__game_button-next">${
      i + 1 === questions.length ? currentLang['quiz__game_button-try'] : currentLang['quiz__game_button-next']
    }</button>`;
    const question = document.querySelector('.quiz__question');
    const quizAnswers = document.querySelector('.quiz__answers');
    const description = document.querySelector('.quiz__description');
    const next = document.querySelector('.quiz__game_button-next');
    const id = questions[i].id;
    const showScore = document.querySelector('.quiz__score_n');

    if (!question || !quizAnswers || !description || !next || !showScore) return;

    i + 1 === questions.length ? next.classList.add('last') : next.classList.remove('last');

    {
      question.innerHTML = `${isEnglish ? questions[i].question.en : questions[i].question.ru}`;
      for (let j = 0; j < questions[i].answers.en.length; j++) {
        const li = document.createElement('li');
        li.id = `ans${j + 1}`;
        li.classList.add('quiz__answers_item');
        li.innerHTML = `${isEnglish ? questions[i].answers.en[j] : questions[i].answers.ru[j]}`;
        quizAnswers.appendChild(li);
      }
    }

    let isAnswered = false;
    const answers = document.querySelectorAll('.quiz__answers_item');
    answers.forEach((answer) => {
      answer.addEventListener('click', async () => {
        if (isAnswered) return;
        isAnswered = true;
        const data = (
          await fetch(`${config.server}/quiz`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              answers: [
                {
                  id: id,
                  answer: answer.innerHTML,
                },
              ],
            }),
          })
        ).json();
        data.then((result) => {
          description.innerHTML = `${config.lang === 'en' ? questions[i].desc.en : questions[i].desc.ru}`;
          if (result.result.correct === 1) {
            answer.classList.add('quiz__answers_item-correct');
            score++;
            showScore.innerHTML = `${score}`;
          } else {
            answer.classList.add('quiz__answers_item-wrong');
            const right = `${config.lang === 'en' ? result.result.corrAnswers[0].en : result.result.corrAnswers[0].ru}`;
            answers.forEach((answer) => {
              if (answer.innerHTML === right) {
                answer.classList.add('quiz__answers_item-correct');
              }
            });
          }
          next.classList.add('quiz__game_button-next-active');
          i++;
          if (i === questions.length) this.showResult(score);
        });
      });
    });

    next.addEventListener('click', async () => {
      if (!next.classList.contains('quiz__game_button-next-active')) return;

      if (i !== questions.length) {
        this.game(questions, i, score);
        return;
      }
      const newQuestions = await this.getQuestions();
      this.game(newQuestions, 0, 0);
    });
  }

  showResult(score: number) {
    const result = document.querySelector('.quiz__result');
    if (!result) return;

    switch (score) {
      case 0:
        config.lang === 'en' ? (result.innerHTML = '0/5 - You a looser! A-ha-ha') : (result.innerHTML = '0/5 - Ужас!');
        break;
      case 1:
        config.lang === 'en'
          ? (result.innerHTML = '1/5 - It is better then nothing')
          : (result.innerHTML = '1/5 - Лучше, чем ничего');
        break;
      case 2:
        config.lang === 'en'
          ? (result.innerHTML = '2/5 - Something went wrong')
          : (result.innerHTML = '2/5 - Что-то пошло не так');
        break;
      case 3:
        config.lang === 'en' ? (result.innerHTML = '3/5 - You was near') : (result.innerHTML = '3/5 - Вы были близко');
        break;
      case 4:
        config.lang === 'en'
          ? (result.innerHTML = '4/5 - Nearly! Next time will be better')
          : (result.innerHTML = '4/5 - В следующий раз повезёт больше');
        break;
      case 5:
        config.lang === 'en'
          ? (result.innerHTML = '5/5 - Great! Not like the rss test')
          : (result.innerHTML = '5/5 - Отлично! Это вам не тесты в RSS');
        break;
    }
  }
}

export const buildQuiz = new BuildQuiz();
