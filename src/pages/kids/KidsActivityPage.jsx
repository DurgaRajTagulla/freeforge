import { useMemo, useEffect, useState, lazy, Suspense } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './KidsActivities.css';

const QuizTemplate = lazy(() => import('./QuizTemplate'));
const MatchingTemplate = lazy(() => import('./MatchingTemplate'));
const DrawingCanvas = lazy(() => import('./DrawingCanvas'));
const QuizIntro = lazy(() => import('./QuizIntro'));
const AlphabetMatchGrid = lazy(() => import('./AlphabetMatchGrid'));
const ShapeMatchingGrid = lazy(() => import('./ShapeMatchingGrid'));

const SudokuKids = lazy(() => import('./components/MathLogicGames').then(m => ({ default: m.SudokuKids })));
const TicTacToeAI = lazy(() => import('./components/MathLogicGames').then(m => ({ default: m.TicTacToeAI })));

const ConnectFour = lazy(() => import('./components/PuzzleGames').then(m => ({ default: m.ConnectFour })));
const MazeEscape = lazy(() => import('./components/PuzzleGames').then(m => ({ default: m.MazeEscape })));
const SpotDifference = lazy(() => import('./components/PuzzleGames').then(m => ({ default: m.SpotDifference })));
const EmojiStory = lazy(() => import('./components/PuzzleGames').then(m => ({ default: m.EmojiStory })));
const BuildWords = lazy(() => import('./components/PuzzleGames').then(m => ({ default: m.BuildWords })));
const ArrangeSentences = lazy(() => import('./components/PuzzleGames').then(m => ({ default: m.ArrangeSentences })));

const ChessKids = lazy(() => import('./components/DailyGames').then(m => ({ default: m.ChessKids })));

import { generateAlphabetMatchPairs, generateAnimalSoundQuestions, generateCountQuestions, generateShapePairs, generateColorQuestions, generateFruitVegetablePairs, generateVehicleQuestions } from './generators';

function RedirectGame({ to, title }) {
  const navigate = useNavigate();
  useEffect(() => { navigate(to); }, [navigate, to]);
  return (
    <div className="activity-page">
      <div className="celebration">
        <h2>🎮 {title}</h2>
        <p>Redirecting to game...</p>
      </div>
    </div>
  );
}


export default function KidsActivityPage() {
  const { activityId } = useParams();
  const navigate = useNavigate();
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => { setShowIntro(true); }, [activityId]);

  const activityData = useMemo(() => {
    switch (activityId) {
      case 'alphabet-match': return { pairs: generateAlphabetMatchPairs() };
      case 'animal-sound-quiz': return { questions: generateAnimalSoundQuestions() };
      case 'count-the-objects': return { questions: generateCountQuestions() };
      case 'shape-matching': return { pairs: generateShapePairs() };
      case 'color-recognition': return { questions: generateColorQuestions() };
      case 'fruit-vegetable-names': return { pairs: generateFruitVegetablePairs() };
      case 'vehicle-identification': return { questions: generateVehicleQuestions() };
      default: return null;
    }
  }, [activityId]);

  const renderContent = () => {
    switch (activityId) {
    /* ========== PRESCHOOL ========== */
    case 'alphabet-match':
      return <AlphabetMatchGrid />;
    case 'animal-sound-quiz':
      return <QuizTemplate questions={activityData.questions} title="🐶 Animal Sound Quiz" pageSize={20} />;
    case 'count-the-objects':
      return <QuizTemplate questions={activityData.questions} title="🔢 Count the Objects" pageSize={5} />;
    case 'shape-matching':
      return <ShapeMatchingGrid />;
    case 'color-recognition':
      return <QuizTemplate questions={activityData.questions} title="🌈 Color Recognition" pageSize={5} />;
    case 'fruit-vegetable-names':
      return <MatchingTemplate pairs={activityData.pairs} title="🍎 Fruit & Vegetable Names" itemLabel="fruit/vegetable" compact pageSize={10} />;
    case 'vehicle-identification':
      return <QuizTemplate questions={activityData.questions} title="🚗 Vehicle Identification" pageSize={5} />;
    case 'memory-card-game':
      return <RedirectGame to="/games" title="Memory Card Game" />;
    case 'trace-letters':
      return <DrawingCanvas title="✏️ Trace Letters" />;

    /* ========== PRIMARY MATH ========== */
    case 'addition-race': {
      const qs = Array.from({ length: 75 }, () => {
        const a = Math.floor(Math.random() * 20) + 1;
        const b = Math.floor(Math.random() * 20) + 1;
        const correct = a + b;
        const opts = [correct, correct + Math.floor(Math.random() * 5) + 1, Math.max(1, correct - Math.floor(Math.random() * 5) - 1), correct + Math.floor(Math.random() * 3) + 2];
        const options = [...new Set(opts)].sort((a,b) => a-b).map(String);
        return { question: `${a} + ${b} = ?`, options, correctIndex: options.indexOf(String(correct)), emoji: '➕' };
      });
      return <QuizTemplate questions={qs} title="➕ Addition Race" pageSize={5} />;
    }
    case 'subtraction-challenge': {
      const qs = Array.from({ length: 75 }, () => {
        const a = Math.floor(Math.random() * 20) + 10;
        const b = Math.floor(Math.random() * a) + 1;
        const correct = a - b;
        const opts = [correct, correct + Math.floor(Math.random() * 5) + 1, Math.max(0, correct - Math.floor(Math.random() * 5) - 1), correct + Math.floor(Math.random() * 3) + 2];
        const options = [...new Set(opts)].sort((a,b) => a-b).map(String);
        return { question: `${a} - ${b} = ?`, options, correctIndex: options.indexOf(String(correct)), emoji: '➖' };
      });
      return <QuizTemplate questions={qs} title="➖ Subtraction Challenge" pageSize={5} />;
    }
    case 'multiplication-tables': {
      const qs = Array.from({ length: 75 }, () => {
        const a = Math.floor(Math.random() * 10) + 1;
        const b = Math.floor(Math.random() * 10) + 1;
        const correct = a * b;
        const opts = [correct, correct + Math.floor(Math.random() * 10) + 1, Math.max(1, correct - Math.floor(Math.random() * 10) - 1), correct + Math.floor(Math.random() * 5) + 5];
        const options = [...new Set(opts)].sort((a,b) => a-b).map(String);
        return { question: `${a} × ${b} = ?`, options, correctIndex: options.indexOf(String(correct)), emoji: '✖️' };
      });
      return <QuizTemplate questions={qs} title="✖️ Multiplication Tables" pageSize={5} />;
    }
    case 'division-practice': {
      const qs = Array.from({ length: 75 }, () => {
        const b = Math.floor(Math.random() * 9) + 2;
        const correct = Math.floor(Math.random() * 10) + 1;
        const a = b * correct;
        const opts = [correct, correct + Math.floor(Math.random() * 5) + 1, Math.max(1, correct - Math.floor(Math.random() * 5) - 1), correct + Math.floor(Math.random() * 3) + 2];
        const options = [...new Set(opts)].sort((a,b) => a-b).map(String);
        return { question: `${a} ÷ ${b} = ?`, options, correctIndex: options.indexOf(String(correct)), emoji: '➗' };
      });
      return <QuizTemplate questions={qs} title="➗ Division Practice" pageSize={5} />;
    }
    case 'fractions-game': {
      const qs = [
        { question: 'What is 1/2 of 8?', options: ['2', '3', '4', '6'], correctIndex: 2, emoji: '🍕' },
        { question: 'What is 1/4 of 12?', options: ['2', '3', '4', '6'], correctIndex: 1, emoji: '🍕' },
        { question: 'Which is larger: 1/2 or 1/4?', options: ['1/4', '1/2', 'Same', 'Neither'], correctIndex: 1, emoji: '📊' },
        { question: 'What is 3/4 of 16?', options: ['9', '10', '12', '14'], correctIndex: 2, emoji: '🍕' },
        { question: 'How many halves in a whole?', options: ['1', '2', '3', '4'], correctIndex: 1, emoji: '🔢' },
        { question: 'What is 1/3 of 9?', options: ['2', '3', '4', '6'], correctIndex: 1, emoji: '🍕' },
        { question: 'Which fraction is bigger: 2/3 or 1/3?', options: ['1/3', '2/3', 'Same', 'Neither'], correctIndex: 1, emoji: '📊' },
        { question: 'What is 1/2 + 1/2?', options: ['1', '1/2', '2', '1/4'], correctIndex: 0, emoji: '➕' },
        { question: 'What is 1/5 of 20?', options: ['2', '3', '4', '5'], correctIndex: 3, emoji: '🍕' },
        { question: 'How many quarters in a whole?', options: ['2', '3', '4', '5'], correctIndex: 2, emoji: '🔢' },
        { question: 'Which is smaller: 1/6 or 1/3?', options: ['1/6', '1/3', 'Same', 'Neither'], correctIndex: 0, emoji: '📊' },
        { question: 'What is 2/5 of 15?', options: ['4', '5', '6', '8'], correctIndex: 2, emoji: '🍕' },
        { question: 'What is 3/4 - 1/4?', options: ['1/2', '1/4', '3/4', '1'], correctIndex: 0, emoji: '➖' },
        { question: 'How many thirds in a whole?', options: ['1', '2', '3', '4'], correctIndex: 2, emoji: '🔢' },
        { question: 'Which is bigger: 3/8 or 1/4?', options: ['1/4', '3/8', 'Same', 'Neither'], correctIndex: 1, emoji: '📊' },
        { question: 'What is 1/2 of 14?', options: ['4', '5', '6', '7'], correctIndex: 3, emoji: '🍕' },
        { question: 'What is 1/3 + 1/3?', options: ['1/3', '2/3', '1', '1/6'], correctIndex: 1, emoji: '➕' },
        { question: 'Which fraction equals 1?', options: ['2/4', '3/4', '4/4', '1/4'], correctIndex: 2, emoji: '📊' },
        { question: 'What is 3/5 of 10?', options: ['3', '4', '5', '6'], correctIndex: 3, emoji: '🍕' },
        { question: 'How many eighths in a half?', options: ['2', '3', '4', '5'], correctIndex: 2, emoji: '🔢' },
        { question: 'What is 5/6 - 2/6?', options: ['1/6', '2/6', '3/6', '4/6'], correctIndex: 2, emoji: '➖' },
        { question: 'Which is bigger: 4/5 or 3/5?', options: ['3/5', '4/5', 'Same', 'Neither'], correctIndex: 1, emoji: '📊' },
        { question: 'What is 1/4 of 24?', options: ['4', '5', '6', '8'], correctIndex: 2, emoji: '🍕' },
        { question: 'What is 2/3 + 1/3?', options: ['2/3', '1', '3/3', 'Both B and C'], correctIndex: 3, emoji: '➕' },
        { question: 'Which fraction is closest to 0?', options: ['1/2', '1/4', '1/8', '3/4'], correctIndex: 2, emoji: '📊' },
        { question: 'Which is bigger: 2/5 or 3/5?', options: ['2/5', '3/5', 'Same', 'Neither'], correctIndex: 1, emoji: '📊' },
        { question: 'What is 1/4 + 1/4?', options: ['1/2', '1/4', '2/4', 'Both A and C'], correctIndex: 3, emoji: '➕' },
        { question: 'How many sixths in 1 whole?', options: ['3', '4', '5', '6'], correctIndex: 3, emoji: '🔢' },
        { question: 'Which is smaller: 2/3 or 3/3?', options: ['2/3', '3/3', 'Same', 'Neither'], correctIndex: 0, emoji: '📊' },
        { question: 'What is 1/2 of 20?', options: ['5', '8', '10', '12'], correctIndex: 2, emoji: '🍕' },
        { question: 'What is 2/4 + 1/4?', options: ['1/4', '3/4', '2/4', '1'], correctIndex: 1, emoji: '➕' },
        { question: 'Which fraction equals 1/2?', options: ['2/8', '4/8', '6/8', '1/8'], correctIndex: 1, emoji: '📊' },
        { question: 'What is 3/3 of 15?', options: ['3', '5', '10', '15'], correctIndex: 3, emoji: '🍕' },
        { question: 'How many tenths in a half?', options: ['2', '3', '4', '5'], correctIndex: 3, emoji: '🔢' },
        { question: 'What is 4/5 - 1/5?', options: ['1/5', '2/5', '3/5', '4/5'], correctIndex: 2, emoji: '➖' },
        { question: 'Which is bigger: 5/6 or 1/6?', options: ['1/6', '5/6', 'Same', 'Neither'], correctIndex: 1, emoji: '📊' },
        { question: 'What is 1/3 of 18?', options: ['3', '4', '5', '6'], correctIndex: 3, emoji: '🍕' },
        { question: 'What is 1/2 + 1/4?', options: ['1/4', '2/4', '3/4', '1'], correctIndex: 2, emoji: '➕' },
        { question: 'Which fraction is less than 1/3?', options: ['1/2', '2/3', '1/4', '3/3'], correctIndex: 2, emoji: '📊' },
        { question: 'What is 2/3 of 12?', options: ['4', '6', '8', '9'], correctIndex: 2, emoji: '🍕' },
        { question: 'What is 3/4 + 1/4?', options: ['1/2', '3/4', '1', '4/4'], correctIndex: 2, emoji: '➕' },
        { question: 'Which is bigger: 1/5 or 1/10?', options: ['1/5', '1/10', 'Same', 'Neither'], correctIndex: 0, emoji: '📊' },
        { question: 'What is 1/6 of 24?', options: ['2', '3', '4', '6'], correctIndex: 2, emoji: '🍕' },
        { question: 'What is 1/3 + 2/3?', options: ['1/3', '2/3', '1', '3/3'], correctIndex: 2, emoji: '➕' },
        { question: 'Which fraction is closest to 1?', options: ['1/8', '3/4', '1/2', '1/10'], correctIndex: 1, emoji: '📊' },
        { question: 'What is 4/5 of 25?', options: ['15', '16', '18', '20'], correctIndex: 3, emoji: '🍕' },
        { question: 'What is 1/2 - 1/4?', options: ['1/2', '1/4', '3/4', '1'], correctIndex: 1, emoji: '➖' },
        { question: 'How many sevenths in a whole?', options: ['5', '6', '7', '8'], correctIndex: 2, emoji: '🔢' },
        { question: 'Which is smaller: 3/4 or 4/5?', options: ['3/4', '4/5', 'Same', 'Neither'], correctIndex: 0, emoji: '📊' },
        { question: 'What is 3/5 of 20?', options: ['8', '10', '12', '15'], correctIndex: 2, emoji: '🍕' },
        { question: 'What is 5/6 + 1/6?', options: ['5/6', '6/6', '1', 'Both B and C'], correctIndex: 3, emoji: '➕' },
        { question: 'Which fraction is more than 1?', options: ['3/4', '2/3', '5/4', '1/2'], correctIndex: 2, emoji: '📊' },
        { question: 'What is 1/4 of 32?', options: ['4', '6', '8', '10'], correctIndex: 2, emoji: '🍕' },
        { question: 'What is 2/3 - 1/3?', options: ['1/3', '2/3', '1', '1/6'], correctIndex: 0, emoji: '➖' },
        { question: 'How many fifths in 2 wholes?', options: ['5', '8', '10', '12'], correctIndex: 2, emoji: '🔢' },
        { question: 'Which is bigger: 4/7 or 3/7?', options: ['3/7', '4/7', 'Same', 'Neither'], correctIndex: 1, emoji: '📊' },
        { question: 'What is 2/5 of 30?', options: ['6', '8', '10', '12'], correctIndex: 3, emoji: '🍕' },
        { question: 'What is 1/2 + 1/6?', options: ['1/3', '2/3', '4/6', 'Both A and C'], correctIndex: 3, emoji: '➕' },
        { question: 'Which is closer to 0: 1/3 or 1/8?', options: ['1/3', '1/8', 'Same', 'Neither'], correctIndex: 1, emoji: '📊' },
        { question: 'What is 5/8 of 16?', options: ['5', '8', '10', '12'], correctIndex: 2, emoji: '🍕' },
        { question: 'What is 3/4 - 1/2?', options: ['1/4', '1/2', '3/4', '1'], correctIndex: 0, emoji: '➖' },
        { question: 'Which equals 3/6?', options: ['1/2', '1/3', '2/3', '1/6'], correctIndex: 0, emoji: '📊' },
        { question: 'What is 1/7 of 21?', options: ['1', '2', '3', '4'], correctIndex: 2, emoji: '🍕' },
        { question: 'What is 2/5 + 2/5?', options: ['2/5', '3/5', '4/5', '1'], correctIndex: 2, emoji: '➕' },
        { question: 'How many fourths in 3 wholes?', options: ['4', '8', '10', '12'], correctIndex: 3, emoji: '🔢' },
        { question: 'Which is smaller: 5/8 or 3/4?', options: ['5/8', '3/4', 'Same', 'Neither'], correctIndex: 0, emoji: '📊' },
        { question: 'What is 3/4 of 12?', options: ['6', '8', '9', '10'], correctIndex: 2, emoji: '🍕' },
        { question: 'What is 4/5 - 2/5?', options: ['1/5', '2/5', '3/5', '4/5'], correctIndex: 1, emoji: '➖' },
        { question: 'Which fraction equals 2/3?', options: ['4/6', '3/6', '5/6', '2/6'], correctIndex: 0, emoji: '📊' },
        { question: 'What is 1/2 of 26?', options: ['10', '11', '12', '13'], correctIndex: 3, emoji: '🍕' },
        { question: 'What is 1/8 + 3/8?', options: ['2/8', '3/8', '4/8', '5/8'], correctIndex: 2, emoji: '➕' },
        { question: 'Which is bigger: 7/10 or 3/10?', options: ['3/10', '7/10', 'Same', 'Neither'], correctIndex: 1, emoji: '📊' },
        { question: 'What is 2/9 of 18?', options: ['2', '3', '4', '6'], correctIndex: 2, emoji: '🍕' },
        { question: 'What is 5/8 - 3/8?', options: ['1/8', '2/8', '3/8', '4/8'], correctIndex: 1, emoji: '➖' },
        { question: 'What is 3/10 + 4/10?', options: ['6/10', '7/10', '8/10', '9/10'], correctIndex: 1, emoji: '➕' }
      ];
      return <QuizTemplate questions={qs} title="🍕 Fractions Game" pageSize={5} />;
    }
    case 'clock-reading': {
      const qs = [
        { question: 'What time is 3:00?', options: ['Three o\'clock', 'Three thirty', 'Two o\'clock', 'Four o\'clock'], correctIndex: 0, emoji: '🕐' },
        { question: 'How many minutes in an hour?', options: ['30', '45', '60', '100'], correctIndex: 2, emoji: '⏰' },
        { question: 'What time is 6:30?', options: ['Six o\'clock', 'Half past six', 'Six thirty', 'Both B and C'], correctIndex: 3, emoji: '🕡' },
        { question: 'Which hand is the shortest?', options: ['Hour', 'Minute', 'Second', 'All same'], correctIndex: 0, emoji: '🕐' },
        { question: 'What time is 12:00 noon?', options: ['Morning', 'Noon', 'Evening', 'Night'], correctIndex: 1, emoji: '🕛' },
        { question: 'How many hours from 9am to 3pm?', options: ['4', '5', '6', '7'], correctIndex: 2, emoji: '⏰' },
        { question: 'What time is half past 1?', options: ['1:00', '1:30', '2:00', '12:30'], correctIndex: 1, emoji: '🕜' },
        { question: 'Which comes first: 7am or 7pm?', options: ['7pm', '7am', 'Same', 'Neither'], correctIndex: 1, emoji: '🌅' },
        { question: 'How many hours in a day?', options: ['12', '24', '48', '36'], correctIndex: 1, emoji: '⏰' },
        { question: 'What time is 9:15?', options: ['Nine o\'clock', 'Quarter past nine', 'Nine thirty', 'Quarter to nine'], correctIndex: 1, emoji: '🕤' },
        { question: 'Which hand moves fastest?', options: ['Hour', 'Minute', 'Second', 'All same'], correctIndex: 2, emoji: '🕐' },
        { question: 'What time is 4:45?', options: ['Quarter past 4', 'Quarter to 5', 'Four forty-five', 'Both B and C'], correctIndex: 3, emoji: '🕟' },
        { question: 'How many minutes in half an hour?', options: ['15', '30', '45', '60'], correctIndex: 1, emoji: '⏰' },
        { question: 'What time is 7:00?', options: ['Seven o\'clock', 'Seven thirty', 'Eight o\'clock', 'Six o\'clock'], correctIndex: 0, emoji: '🕖' },
        { question: 'What is 3:00 + 2 hours?', options: ['4:00', '5:00', '6:00', '7:00'], correctIndex: 1, emoji: '⏰' },
        { question: 'How many minutes from 8:00 to 8:45?', options: ['15', '30', '45', '60'], correctIndex: 2, emoji: '⏰' },
        { question: 'What time is half past 11?', options: ['11:00', '11:30', '12:00', '12:30'], correctIndex: 1, emoji: '🕦' },
        { question: 'Which is longer: 1 hour or 100 minutes?', options: ['1 hour', '100 minutes', 'Same', 'Neither'], correctIndex: 1, emoji: '⏰' },
        { question: 'What time is quarter to 3?', options: ['2:15', '2:45', '3:15', '3:45'], correctIndex: 1, emoji: '🕧' },
        { question: 'How many hours from 2pm to 8pm?', options: ['4', '5', '6', '7'], correctIndex: 2, emoji: '⏰' },
        { question: 'What time is 10:30?', options: ['Ten o\'clock', 'Half past ten', 'Ten fifteen', 'Eleven o\'clock'], correctIndex: 1, emoji: '🕥' },
        { question: 'How many half hours in 3 hours?', options: ['3', '4', '5', '6'], correctIndex: 3, emoji: '⏰' },
        { question: 'What time is quarter past 6?', options: ['6:00', '6:15', '6:30', '6:45'], correctIndex: 1, emoji: '🕡' },
        { question: 'Which comes first: 3pm or 3am?', options: ['3pm', '3am', 'Same', 'Neither'], correctIndex: 1, emoji: '🌅' },
        { question: 'What time is 8:00?', options: ['Seven o\'clock', 'Eight o\'clock', 'Nine o\'clock', 'Eight thirty'], correctIndex: 1, emoji: '🕗' },
        { question: 'What time is 2:15?', options: ['Two o\'clock', 'Quarter past two', 'Two thirty', 'Quarter to two'], correctIndex: 1, emoji: '🕡' },
        { question: 'How many minutes in 3 hours?', options: ['120', '150', '180', '200'], correctIndex: 2, emoji: '⏰' },
        { question: 'What is 5:00 + 3 hours?', options: ['6:00', '7:00', '8:00', '9:00'], correctIndex: 2, emoji: '⏰' },
        { question: 'What time is 11:45?', options: ['Quarter past 11', 'Quarter to 12', 'Eleven forty-five', 'Both B and C'], correctIndex: 3, emoji: '🕧' },
        { question: 'How many minutes from 3:00 to 3:30?', options: ['15', '30', '45', '60'], correctIndex: 1, emoji: '⏰' },
        { question: 'What time is half past 7?', options: ['7:00', '7:30', '8:00', '7:15'], correctIndex: 1, emoji: '🕢' },
        { question: 'Which comes later: 6am or 6pm?', options: ['6am', '6pm', 'Same', 'Neither'], correctIndex: 1, emoji: '🌅' },
        { question: 'What time is quarter past 9?', options: ['9:00', '9:15', '9:30', '9:45'], correctIndex: 1, emoji: '🕤' },
        { question: 'How many hours from 10am to 5pm?', options: ['5', '6', '7', '8'], correctIndex: 2, emoji: '⏰' },
        { question: 'What time is 1:00?', options: ['Twelve o\'clock', 'One o\'clock', 'Two o\'clock', 'One thirty'], correctIndex: 1, emoji: '🕐' },
        { question: 'How many half hours in 2 hours?', options: ['2', '3', '4', '6'], correctIndex: 2, emoji: '⏰' },
        { question: 'What time is quarter to 6?', options: ['5:15', '5:45', '6:15', '6:45'], correctIndex: 1, emoji: '🕠' },
        { question: 'What is 10:30 + 30 minutes?', options: ['10:45', '11:00', '11:15', '11:30'], correctIndex: 1, emoji: '⏰' },
        { question: 'What time is 5:15?', options: ['Five o\'clock', 'Quarter past five', 'Five thirty', 'Quarter to five'], correctIndex: 1, emoji: '🕠' },
        { question: 'How many hours from 12am to 12pm?', options: ['6', '12', '18', '24'], correctIndex: 1, emoji: '⏰' },
        { question: 'Which comes first: 11am or 11pm?', options: ['11am', '11pm', 'Same', 'Neither'], correctIndex: 0, emoji: '🌅' },
        { question: 'What time is 12:45?', options: ['Quarter past 12', 'Quarter to 1', 'Twelve forty-five', 'Both B and C'], correctIndex: 3, emoji: '🕧' },
        { question: 'How many minutes from 7:00 to 7:15?', options: ['5', '10', '15', '20'], correctIndex: 2, emoji: '⏰' },
        { question: 'What time is quarter past 4?', options: ['4:00', '4:15', '4:30', '4:45'], correctIndex: 1, emoji: '🕟' },
        { question: 'What is 2:30 + 1 hour?', options: ['3:00', '3:30', '4:00', '4:30'], correctIndex: 1, emoji: '⏰' },
        { question: 'What time is 11:30?', options: ['Eleven o\'clock', 'Half past eleven', 'Twelve o\'clock', 'Eleven fifteen'], correctIndex: 1, emoji: '🕦' },
        { question: 'How many quarter hours in 2 hours?', options: ['2', '4', '6', '8'], correctIndex: 3, emoji: '⏰' },
        { question: 'What time is quarter to 10?', options: ['9:15', '9:45', '10:15', '10:45'], correctIndex: 1, emoji: '🕤' },
        { question: 'Which is longer: 90 minutes or 2 hours?', options: ['90 minutes', '2 hours', 'Same', 'Neither'], correctIndex: 1, emoji: '⏰' },
        { question: 'What time is 6:45?', options: ['Quarter past 6', 'Quarter to 7', 'Six forty-five', 'Both B and C'], correctIndex: 3, emoji: '🕡' },
        { question: 'How many hours from 7am to 2pm?', options: ['5', '6', '7', '8'], correctIndex: 2, emoji: '⏰' },
        { question: 'What time is half past 9?', options: ['9:00', '9:15', '9:30', '9:45'], correctIndex: 2, emoji: '🕤' },
        { question: 'What is 4:15 + 45 minutes?', options: ['4:45', '5:00', '5:15', '5:30'], correctIndex: 1, emoji: '⏰' },
        { question: 'How many seconds in a minute?', options: ['30', '45', '60', '100'], correctIndex: 2, emoji: '⏰' },
        { question: 'What time is 3:30?', options: ['Three o\'clock', 'Half past three', 'Three fifteen', 'Three forty-five'], correctIndex: 1, emoji: '🕞' },
        { question: 'Which comes first: 2pm or 3pm?', options: ['2pm', '3pm', 'Same', 'Neither'], correctIndex: 0, emoji: '🌅' },
        { question: 'What time is quarter to 12?', options: ['11:15', '11:45', '12:15', '12:45'], correctIndex: 1, emoji: '🕧' },
        { question: 'How many minutes in a quarter hour?', options: ['10', '15', '20', '30'], correctIndex: 1, emoji: '⏰' },
        { question: 'What time is 10:15?', options: ['Ten o\'clock', 'Quarter past ten', 'Ten thirty', 'Quarter to ten'], correctIndex: 1, emoji: '🕥' },
        { question: 'What is 7:00 + 4 hours?', options: ['10:00', '11:00', '12:00', '1:00'], correctIndex: 1, emoji: '⏰' },
        { question: 'How many hours from 9pm to 6am?', options: ['7', '8', '9', '10'], correctIndex: 2, emoji: '⏰' },
        { question: 'What time is 8:15?', options: ['Eight o\'clock', 'Quarter past eight', 'Eight thirty', 'Quarter to eight'], correctIndex: 1, emoji: '🕗' },
        { question: 'Which is longer: 1 hour or 50 minutes?', options: ['1 hour', '50 minutes', 'Same', 'Neither'], correctIndex: 0, emoji: '⏰' },
        { question: 'What time is half past 5?', options: ['5:00', '5:15', '5:30', '5:45'], correctIndex: 2, emoji: '🕠' },
        { question: 'How many quarter hours in 3 hours?', options: ['3', '6', '9', '12'], correctIndex: 3, emoji: '⏰' },
        { question: 'What time is 1:45?', options: ['Quarter past 1', 'Quarter to 2', 'One forty-five', 'Both B and C'], correctIndex: 3, emoji: '🕐' },
        { question: 'What is 11:30 + 30 minutes?', options: ['11:45', '12:00', '12:15', '12:30'], correctIndex: 1, emoji: '⏰' },
        { question: 'How many minutes from 4:00 to 4:45?', options: ['15', '30', '40', '45'], correctIndex: 3, emoji: '⏰' },
        { question: 'What time is quarter past 12?', options: ['12:00', '12:15', '12:30', '12:45'], correctIndex: 1, emoji: '🕛' },
        { question: 'Which comes first: 5am or 4pm?', options: ['5am', '4pm', 'Same', 'Neither'], correctIndex: 0, emoji: '🌅' },
        { question: 'What time is 9:45?', options: ['Quarter past 9', 'Quarter to 10', 'Nine forty-five', 'Both B and C'], correctIndex: 3, emoji: '🕤' },
        { question: 'How many hours from 1pm to 11pm?', options: ['8', '9', '10', '11'], correctIndex: 2, emoji: '⏰' },
        { question: 'What is 6:30 + 1 hour 30 minutes?', options: ['7:00', '7:30', '8:00', '8:30'], correctIndex: 2, emoji: '⏰' },
        { question: 'What time is half past 2?', options: ['2:00', '2:15', '2:30', '2:45'], correctIndex: 2, emoji: '🕑' },
        { question: 'How many minutes from 1:00 to 1:50?', options: ['30', '40', '50', '60'], correctIndex: 2, emoji: '⏰' }
      ];
      return <QuizTemplate questions={qs} title="🕐 Clock Reading" pageSize={5} />;
    }
    case 'sudoku-kids': return <SudokuKids />;

    /* ========== PRIMARY SCIENCE ========== */
    case 'human-body-quiz': {
      if (showIntro) {
        return (
          <QuizIntro
            title="🫀 Human Body Quiz"
            emoji="🫀"
            content={[
              "Your amazing body is like a super machine! Study the body parts and their functions below, then test your knowledge in the quiz!"
            ]}
            referenceTitle="🫀 Body Parts & Functions — Memorize Them!"
            referenceList={[
              { emoji: '🧠', label: 'Brain', sublabel: 'Thinks & controls body' },
              { emoji: '❤️', label: 'Heart', sublabel: 'Pumps blood' },
              { emoji: '🫁', label: 'Lungs', sublabel: 'Help us breathe' },
              { emoji: '🦴', label: 'Bones', sublabel: '206 in adult body' },
              { emoji: '💪', label: 'Muscles', sublabel: 'Help us move' },
              { emoji: '🩸', label: 'Blood', sublabel: 'Carries oxygen' },
              { emoji: '👂', label: 'Ears', sublabel: 'Help us hear' },
              { emoji: '👀', label: 'Eyes', sublabel: 'Help us see' },
              { emoji: '👃', label: 'Nose', sublabel: 'Helps us smell' },
              { emoji: '👅', label: 'Tongue', sublabel: 'Helps us taste' },
              { emoji: '🦷', label: 'Teeth', sublabel: '32 in adult mouth' },
              { emoji: '🫀', label: 'Skin', sublabel: 'Largest organ' },
              { emoji: '🫁', label: 'Stomach', sublabel: 'Digests food' },
              { emoji: '🫀', label: 'Liver', sublabel: 'Cleans blood' },
              { emoji: '🦴', label: 'Joints', sublabel: 'Help body bend' },
              { emoji: '🦴', label: 'Ribs', sublabel: '12 pairs protect chest' },
              { emoji: '🩸', label: 'White blood cells', sublabel: 'Fight germs' },
              { emoji: '🩸', label: 'Red blood cells', sublabel: 'Carry oxygen' }
            ]}
            facts={[
              "Your heart beats about 100,000 times every day",
              "Adults have 206 bones — babies have about 300!",
              "Your skin is your largest organ and covers your whole body",
              "Your brain uses 20% of all the oxygen you breathe"
            ]}
            onStart={() => setShowIntro(false)}
          />
        );
      }
      const qs = [
        { question: 'How many bones does a baby have?', options: ['100', '200', '300', '400'], correctIndex: 2, emoji: '👶' },
        { question: 'What organ pumps blood?', options: ['Brain', 'Heart', 'Lungs', 'Stomach'], correctIndex: 1, emoji: '❤️' },
        { question: 'What do we use to see?', options: ['Ears', 'Nose', 'Eyes', 'Mouth'], correctIndex: 2, emoji: '👀' },
        { question: 'How many senses do humans have?', options: ['3', '4', '5', '6'], correctIndex: 2, emoji: '👃' },
        { question: 'What do lungs help us do?', options: ['See', 'Hear', 'Breathe', 'Walk'], correctIndex: 2, emoji: '🫁' },
        { question: 'What is the largest organ?', options: ['Heart', 'Brain', 'Skin', 'Liver'], correctIndex: 2, emoji: '🫀' },
        { question: 'What do we use to hear?', options: ['Eyes', 'Ears', 'Nose', 'Tongue'], correctIndex: 1, emoji: '👂' },
        { question: 'What helps us think?', options: ['Heart', 'Brain', 'Stomach', 'Bones'], correctIndex: 1, emoji: '🧠' },
        { question: 'How many bones does an adult have?', options: ['106', '206', '306', '406'], correctIndex: 1, emoji: '🦴' },
        { question: 'What organ helps us digest food?', options: ['Heart', 'Brain', 'Stomach', 'Lungs'], correctIndex: 2, emoji: '🫁' },
        { question: 'What do blood cells carry?', options: ['Water', 'Oxygen', 'Food', 'Air'], correctIndex: 1, emoji: '🩸' },
        { question: 'What is the hardest part of the body?', options: ['Skin', 'Bone', 'Muscle', 'Hair'], correctIndex: 1, emoji: '🦴' },
        { question: 'How many teeth do adults usually have?', options: ['26', '28', '32', '36'], correctIndex: 2, emoji: '🦷' },
        { question: 'What do muscles help us do?', options: ['See', 'Hear', 'Move', 'Breathe'], correctIndex: 2, emoji: '💪' },
        { question: 'What organ cleans our blood?', options: ['Heart', 'Brain', 'Liver', 'Kidneys'], correctIndex: 2, emoji: '🫀' },
        { question: 'What do white blood cells do?', options: ['Carry oxygen', 'Fight germs', 'Digest food', 'Send signals'], correctIndex: 1, emoji: '🩸' },
        { question: 'Where do we think?', options: ['Heart', 'Brain', 'Stomach', 'Bones'], correctIndex: 1, emoji: '🧠' },
        { question: 'What is the function of the nose?', options: ['See', 'Smell', 'Hear', 'Taste'], correctIndex: 1, emoji: '👃' },
        { question: 'How many chambers does the heart have?', options: ['2', '3', '4', '5'], correctIndex: 2, emoji: '❤️' },
        { question: 'What part of the body bends?', options: ['Bones', 'Joints', 'Skin', 'Muscles'], correctIndex: 1, emoji: '🦴' },
        { question: 'What do we use to taste?', options: ['Nose', 'Eyes', 'Tongue', 'Ears'], correctIndex: 2, emoji: '👅' },
        { question: 'What is the largest bone?', options: ['Arm', 'Leg', 'Rib', 'Spine'], correctIndex: 1, emoji: '🦴' },
        { question: 'What helps us balance?', options: ['Eyes', 'Ears', 'Nose', 'Mouth'], correctIndex: 1, emoji: '👂' },
        { question: 'How many ribs do humans have?', options: ['12 pairs', '24 pairs', '10 pairs', '14 pairs'], correctIndex: 0, emoji: '🦴' },
        { question: 'What organ breathes for us?', options: ['Heart', 'Brain', 'Lungs', 'Liver'], correctIndex: 2, emoji: '🫁' }
      ];
      return <QuizTemplate questions={qs} title="🫀 Human Body Quiz" pageSize={5} />;
    }
    case 'solar-system': {
      if (showIntro) {
        return (
          <QuizIntro
            title="🪐 Solar System Quiz"
            emoji="🪐"
            content={[
              "Our solar system has 8 planets orbiting the Sun! Study the planets and their features below, then test your knowledge in the quiz!"
            ]}
            referenceTitle="🪐 The 8 Planets — Memorize Them!"
            referenceList={[
              { emoji: '☀️', label: 'Mercury', sublabel: 'Closest to Sun' },
              { emoji: '🔥', label: 'Venus', sublabel: 'Hottest planet' },
              { emoji: '🌍', label: 'Earth', sublabel: 'Our home planet' },
              { emoji: '🔴', label: 'Mars', sublabel: 'The Red Planet' },
              { emoji: '🪐', label: 'Jupiter', sublabel: 'Largest planet' },
              { emoji: '💍', label: 'Saturn', sublabel: 'Has beautiful rings' },
              { emoji: '🧊', label: 'Uranus', sublabel: 'Spins on its side' },
              { emoji: '🌊', label: 'Neptune', sublabel: 'Farthest from Sun' },
              { emoji: '☀️', label: 'The Sun', sublabel: 'Center star' },
              { emoji: '🌙', label: 'Moon', sublabel: 'Orbits Earth' },
              { emoji: '⭐', label: 'Milky Way', sublabel: 'Our galaxy' },
              { emoji: '☄️', label: 'Asteroids', sublabel: 'Rocky space objects' }
            ]}
            facts={[
              "Jupiter is so big that over 1,300 Earths could fit inside it",
              "Saturn's rings are made of billions of pieces of ice and rock",
              "A day on Venus is longer than a year on Venus!",
              "The Sun is so large that about 1.3 million Earths could fit inside"
            ]}
            onStart={() => setShowIntro(false)}
          />
        );
      }
      const qs = [
        { question: 'Which planet is closest to the Sun?', options: ['Venus', 'Mercury', 'Earth', 'Mars'], correctIndex: 1, emoji: '☀️' },
        { question: 'Which planet is the largest?', options: ['Saturn', 'Jupiter', 'Neptune', 'Uranus'], correctIndex: 1, emoji: '🪐' },
        { question: 'How many planets are in our solar system?', options: ['7', '8', '9', '10'], correctIndex: 1, emoji: '🌌' },
        { question: 'Which planet is known as the Red Planet?', options: ['Venus', 'Mars', 'Jupiter', 'Mercury'], correctIndex: 1, emoji: '🔴' },
        { question: 'What is the star at the center of our solar system?', options: ['Moon', 'Sun', 'Mars', 'Venus'], correctIndex: 1, emoji: '☀️' },
        { question: 'Which planet has the most moons?', options: ['Jupiter', 'Saturn', 'Neptune', 'Uranus'], correctIndex: 1, emoji: '🪐' },
        { question: 'What is a group of stars called?', options: ['A cluster', 'A galaxy', 'A constellation', 'An orbit'], correctIndex: 2, emoji: '⭐' },
        { question: 'Which planet has rings?', options: ['Mars', 'Venus', 'Saturn', 'Mercury'], correctIndex: 2, emoji: '🪐' },
        { question: 'Which planet is known as Earth\'s twin?', options: ['Mars', 'Venus', 'Mercury', 'Jupiter'], correctIndex: 1, emoji: '🌍' },
        { question: 'What is the name of our galaxy?', options: ['Andromeda', 'Milky Way', 'Sombrero', 'Whirlpool'], correctIndex: 1, emoji: '🌌' },
        { question: 'Which planet is farthest from the Sun?', options: ['Neptune', 'Uranus', 'Saturn', 'Jupiter'], correctIndex: 0, emoji: '🪐' },
        { question: 'What is a moon that orbits a planet called?', options: ['Star', 'Satellite', 'Asteroid', 'Comet'], correctIndex: 1, emoji: '🌙' },
        { question: 'Which planet is the hottest?', options: ['Mercury', 'Venus', 'Mars', 'Jupiter'], correctIndex: 1, emoji: '🔥' },
        { question: 'How long does Earth take to orbit the Sun?', options: ['24 hours', '30 days', '365 days', '1000 days'], correctIndex: 2, emoji: '🌍' },
        { question: 'What is Saturn\'s largest moon called?', options: ['Europa', 'Ganymede', 'Titan', 'Io'], correctIndex: 2, emoji: '🪐' },
        { question: 'Which planet has a Great Red Spot?', options: ['Saturn', 'Jupiter', 'Neptune', 'Uranus'], correctIndex: 1, emoji: '🪐' },
        { question: 'What keeps planets in orbit?', options: ['Wind', 'Gravity', 'Light', 'Sound'], correctIndex: 1, emoji: '🌌' },
        { question: 'Which is a dwarf planet?', options: ['Mars', 'Pluto', 'Venus', 'Jupiter'], correctIndex: 1, emoji: '🪐' },
        { question: 'How many moons does Earth have?', options: ['0', '1', '2', '3'], correctIndex: 1, emoji: '🌙' },
        { question: 'Which planet spins on its side?', options: ['Mars', 'Venus', 'Uranus', 'Neptune'], correctIndex: 2, emoji: '🪐' },
        { question: 'What is an asteroid made of?', options: ['Gas', 'Ice and rock', 'Metal and rock', 'Liquid'], correctIndex: 2, emoji: '☄️' },
        { question: 'Which planet has the shortest day?', options: ['Jupiter', 'Saturn', 'Neptune', 'Mercury'], correctIndex: 0, emoji: '🪐' },
        { question: 'What is the asteroid belt between?', options: ['Earth and Mars', 'Mars and Jupiter', 'Jupiter and Saturn', 'Saturn and Uranus'], correctIndex: 1, emoji: '☄️' },
        { question: 'Which planet has blue color from methane?', options: ['Neptune', 'Uranus', 'Both', 'Neither'], correctIndex: 2, emoji: '🪐' },
        { question: 'What causes day and night on Earth?', options: ['Moon orbit', 'Earth\'s rotation', 'Sun moving', 'Clouds'], correctIndex: 1, emoji: '🌍' }
      ];
      return <QuizTemplate questions={qs} title="🪐 Solar System Quiz" pageSize={5} />;
    }
    case 'plant-life-cycle': {
      if (showIntro) {
        return (
          <QuizIntro
            title="🌱 Plant Life Cycle"
            emoji="🌱"
            content={[
              "Plants grow from tiny seeds through an amazing cycle! Study the plant parts and stages below, then test your knowledge in the matching game!"
            ]}
            referenceTitle="🌱 Plant Parts & Stages — Memorize Them!"
            referenceList={[
              { emoji: '🌱', label: 'Seed', sublabel: 'Starting stage' },
              { emoji: '🌱', label: 'Seedling', sublabel: 'Baby plant' },
              { emoji: '🌿', label: 'Sprout', sublabel: 'First leaves appear' },
              { emoji: '☘️', label: 'Stem & Leaves', sublabel: 'Grows upward' },
              { emoji: '🪴', label: 'Roots', sublabel: 'Absorb water' },
              { emoji: '🍃', label: 'Green Leaf', sublabel: 'Makes food from sun' },
              { emoji: '🌷', label: 'Bud', sublabel: 'Flower forming' },
              { emoji: '🌸', label: 'Flower', sublabel: 'Attracts pollinators' },
              { emoji: '🌺', label: 'Petals', sublabel: 'Colorful & fragrant' },
              { emoji: '🌼', label: 'Pollen', sublabel: 'Carried by insects' },
              { emoji: '🍎', label: 'Fruit', sublabel: 'Contains seeds' },
              { emoji: '🌳', label: 'Tree', sublabel: 'Full grown plant' },
              { emoji: '🪵', label: 'Trunk', sublabel: 'Main support' },
              { emoji: '🌳', label: 'Branch', sublabel: 'Holds leaves' },
              { emoji: '💧', label: 'Water', sublabel: 'Essential for growth' },
              { emoji: '🪨', label: 'Soil', sublabel: 'Provides nutrients' }
            ]}
            facts={[
              "Seeds can travel hundreds of miles by wind and water",
              "Some seeds need fire or freezing temperatures to sprout",
              "The fastest-growing plant can grow 35 inches in one day",
              "Sunflowers follow the Sun across the sky during the day"
            ]}
            onStart={() => setShowIntro(false)}
          />
        );
      }
      const steps = [
        { id: 'seed', item: '1. Seed', match: '🌱' },
        { id: 'sprout', item: '2. Sprout', match: '🌿' },
        { id: 'stem', item: '3. Stem & Leaves', match: '☘️' },
        { id: 'flower', item: '4. Flower', match: '🌸' },
        { id: 'fruit', item: '5. Fruit/Seed', match: '🍎' },
        { id: 'roots', item: '6. Roots', match: '🪴' },
        { id: 'bud', item: '7. Bud', match: '🌷' },
        { id: 'petals', item: '8. Petals', match: '🌺' },
        { id: 'branch', item: '9. Branch', match: '🌳' },
        { id: 'trunk', item: '10. Trunk', match: '🪵' },
        { id: 'leaf', item: '11. Green Leaf', match: '🍃' },
        { id: 'sunflower', item: '12. Sunflower', match: '🌻' },
        { id: 'rose', item: '13. Rose', match: '🌹' },
        { id: 'tree', item: '14. Full Tree', match: '🌲' },
        { id: 'mushroom', item: '15. Mushroom', match: '🍄' },
        { id: 'cactus', item: '16. Cactus', match: '🌵' },
        { id: 'palm', item: '17. Palm Tree', match: '🌴' },
        { id: 'herb', item: '18. Herb', match: '🌾' },
        { id: 'garden', item: '19. Garden', match: '🏡' },
        { id: 'water', item: '20. Water', match: '💧' },
        { id: 'soil', item: '21. Soil', match: '🪨' },
        { id: 'seedling', item: '22. Seedling', match: '🌱' },
        { id: 'pollen', item: '23. Pollen', match: '🌼' },
        { id: 'harvest', item: '24. Harvest', match: '🧺' },
        { id: 'compost', item: '25. Compost', match: '♻️' }
      ];
      return <MatchingTemplate pairs={steps} title="🌱 Plant Life Cycle" itemLabel="stage" compact pageSize={5} />;
    }
    case 'weather-quiz': {
      if (showIntro) {
        return (
          <QuizIntro
            title="🌤️ Weather Quiz"
            emoji="🌤️"
            content={[
              "Weather is what happens in the sky every day! Study the weather terms and instruments below, then test your knowledge in the quiz!"
            ]}
            referenceTitle="🌤️ Weather Terms — Memorize Them!"
            referenceList={[
              { emoji: '☀️', label: 'Sunny', sublabel: 'Clear skies, hot' },
              { emoji: '🌧️', label: 'Rain', sublabel: 'Water falling from clouds' },
              { emoji: '❄️', label: 'Snow', sublabel: 'Frozen precipitation' },
              { emoji: '🧊', label: 'Hail', sublabel: 'Frozen rain balls' },
              { emoji: '🌫️', label: 'Fog', sublabel: 'Low cloud near ground' },
              { emoji: '🌬️', label: 'Wind', sublabel: 'Moving air' },
              { emoji: '⛈️', label: 'Thunderstorm', sublabel: 'Lightning + rain' },
              { emoji: '🌪️', label: 'Tornado', sublabel: 'Spinning wind funnel' },
              { emoji: '🌈', label: 'Rainbow', sublabel: 'Rain + sunshine' },
              { emoji: '🌡️', label: 'Thermometer', sublabel: 'Measures temperature' },
              { emoji: '🌡️', label: 'Barometer', sublabel: 'Measures air pressure' },
              { emoji: '🌬️', label: 'Anemometer', sublabel: 'Measures wind speed' },
              { emoji: '🌸', label: 'Spring', sublabel: 'Flowers bloom' },
              { emoji: '☀️', label: 'Summer', sublabel: 'Warmest season' },
              { emoji: '🍂', label: 'Fall', sublabel: 'Leaves fall' },
              { emoji: '❄️', label: 'Winter', sublabel: 'Coldest season' }
            ]}
            facts={[
              "Lightning is five times hotter than the surface of the Sun",
              "Snowflakes always have six sides — every single one!",
              "The highest temperature ever recorded was 134°F in Death Valley",
              "A single cloud can weigh more than a million pounds"
            ]}
            onStart={() => setShowIntro(false)}
          />
        );
      }
      const qs = [
        { question: 'What do clouds bring?', options: ['Snow', 'Rain', 'Wind', 'Sun'], correctIndex: 1, emoji: '☁️' },
        { question: 'What is water vapor that forms clouds?', options: ['Condensation', 'Evaporation', 'Precipitation', 'Freezing'], correctIndex: 1, emoji: '💧' },
        { question: 'What season is coldest?', options: ['Summer', 'Winter', 'Spring', 'Fall'], correctIndex: 1, emoji: '❄️' },
        { question: 'What is frozen rain called?', options: ['Snow', 'Hail', 'Ice', 'Sleet'], correctIndex: 1, emoji: '🧊' },
        { question: 'What causes a rainbow?', options: ['Rain and sun', 'Clouds', 'Wind', 'Snow'], correctIndex: 0, emoji: '🌈' },
        { question: 'What instrument measures temperature?', options: ['Barometer', 'Thermometer', 'Anemometer', 'Rain gauge'], correctIndex: 1, emoji: '🌡️' },
        { question: 'What is very hot weather called?', options: ['Cold', 'Cool', 'Heat wave', 'Breeze'], correctIndex: 2, emoji: '🔥' },
        { question: 'What season do leaves fall?', options: ['Spring', 'Summer', 'Fall', 'Winter'], correctIndex: 2, emoji: '🍂' },
        { question: 'What do we call frozen water falling from clouds?', options: ['Rain', 'Snow', 'Hail', 'Fog'], correctIndex: 1, emoji: '❄️' },
        { question: 'What season is warmest?', options: ['Spring', 'Summer', 'Fall', 'Winter'], correctIndex: 1, emoji: '☀️' },
        { question: 'What is wind?', options: ['Moving water', 'Moving air', 'Moving clouds', 'Moving light'], correctIndex: 1, emoji: '🌬️' },
        { question: 'What instrument measures wind speed?', options: ['Thermometer', 'Anemometer', 'Barometer', 'Compass'], correctIndex: 1, emoji: '🌬️' },
        { question: 'What is a storm with lightning called?', options: ['Blizzard', 'Thunderstorm', 'Tornado', 'Hurricane'], correctIndex: 1, emoji: '⛈️' },
        { question: 'What season comes after winter?', options: ['Summer', 'Fall', 'Spring', 'Winter'], correctIndex: 2, emoji: '🌸' },
        { question: 'What is a large spinning storm called?', options: ['Blizzard', 'Tornado', 'Fog', 'Drizzle'], correctIndex: 1, emoji: '🌪️' },
        { question: 'What is water vapor near the ground called?', options: ['Cloud', 'Fog', 'Rain', 'Snow'], correctIndex: 1, emoji: '🌫️' },
        { question: 'What is a very strong wind called?', options: ['Breeze', 'Gale', 'Drizzle', 'Mist'], correctIndex: 1, emoji: '💨' },
        { question: 'What instrument shows air pressure?', options: ['Thermometer', 'Barometer', 'Rain gauge', 'Compass'], correctIndex: 1, emoji: '🌡️' },
        { question: 'What season do flowers bloom?', options: ['Winter', 'Fall', 'Spring', 'Summer'], correctIndex: 2, emoji: '🌸' },
        { question: 'What is light rain called?', options: ['Storm', 'Drizzle', 'Downpour', 'Blizzard'], correctIndex: 1, emoji: '🌧️' },
        { question: 'What is a hurricane over land called?', options: ['Tornado', 'Typhoon', 'Cyclone', 'Monsoon'], correctIndex: 0, emoji: '🌪️' },
        { question: 'What causes seasons on Earth?', options: ['Moon', 'Earth\'s tilt', 'Clouds', 'Wind'], correctIndex: 1, emoji: '🌍' },
        { question: 'What is a period of no rain called?', options: ['Flood', 'Drought', 'Storm', 'Blizzard'], correctIndex: 1, emoji: '☀️' },
        { question: 'What do we use to predict weather?', options: ['Compass', 'Weather forecast', 'Calendar', 'Clock'], correctIndex: 1, emoji: '📡' },
        { question: 'What is ice fog called?', options: ['Snow', 'Frost', 'Hail', 'Sleet'], correctIndex: 1, emoji: '❄️' }
      ];
      return <QuizTemplate questions={qs} title="🌤️ Weather Quiz" pageSize={5} />;
    }
    case 'animal-classification': {
      if (showIntro) {
        return (
          <QuizIntro
            title="🐾 Animal Classification"
            emoji="🐾"
            content={[
              "Animals are grouped by their features! Study the animal groups and examples below, then test your knowledge in the quiz!"
            ]}
            referenceTitle="🐾 Animal Groups & Examples — Memorize Them!"
            referenceList={[
              { emoji: '🐶', label: 'Mammals', sublabel: 'Warm-blooded, hair, milk' },
              { emoji: '🐕', label: 'Dog', sublabel: 'Mammal' },
              { emoji: '🐋', label: 'Whale', sublabel: 'Mammal (lives in ocean)' },
              { emoji: '🦇', label: 'Bat', sublabel: 'Mammal (can fly!)' },
              { emoji: '🐄', label: 'Cow', sublabel: 'Mammal' },
              { emoji: '🦅', label: 'Birds', sublabel: 'Feathers, lay eggs' },
              { emoji: '🦜', label: 'Parrot', sublabel: 'Bird' },
              { emoji: '🐧', label: 'Penguin', sublabel: 'Bird (can\'t fly)' },
              { emoji: '🐢', label: 'Reptiles', sublabel: 'Cold-blooded, scales' },
              { emoji: '🐍', label: 'Snake', sublabel: 'Reptile' },
              { emoji: '🐊', label: 'Crocodile', sublabel: 'Reptile' },
              { emoji: '🐸', label: 'Amphibians', sublabel: 'Water + land life' },
              { emoji: '🦎', label: 'Newt', sublabel: 'Amphibian' },
              { emoji: '🦈', label: 'Fish', sublabel: 'Gills, lives in water' },
              { emoji: '🐜', label: 'Insects', sublabel: '6 legs, 3 body parts' },
              { emoji: '🕷️', label: 'Spider', sublabel: 'Arachnid (8 legs)' }
            ]}
            facts={[
              "Whales are mammals that live in the ocean and give live birth",
              "Turtles are reptiles that can live for over 100 years",
              "Frogs can absorb water through their skin",
              "There are more species of insects than all other animals combined"
            ]}
            onStart={() => setShowIntro(false)}
          />
        );
      }
      const qs = [
        { question: 'Is a dolphin a mammal or fish?', options: ['Fish', 'Mammal', 'Reptile', 'Amphibian'], correctIndex: 1, emoji: '🐬' },
        { question: 'Which animal is a reptile?', options: ['Frog', 'Turtle', 'Dog', 'Bird'], correctIndex: 1, emoji: '🐢' },
        { question: 'Which is an insect?', options: ['Spider', 'Ant', 'Crab', 'Worm'], correctIndex: 1, emoji: '🐜' },
        { question: 'Which is an amphibian?', options: ['Snake', 'Frog', 'Fish', 'Bird'], correctIndex: 1, emoji: '🐸' },
        { question: 'Is a snake warm-blooded or cold-blooded?', options: ['Warm-blooded', 'Cold-blooded', 'Both', 'Neither'], correctIndex: 1, emoji: '🐍' },
        { question: 'Which is a bird?', options: ['Bat', 'Eagle', 'Bee', 'Butterfly'], correctIndex: 1, emoji: '🦅' },
        { question: 'Which animal lays eggs on land?', options: ['Dog', 'Cat', 'Snake', 'Cow'], correctIndex: 2, emoji: '🥚' },
        { question: 'Which is a mammal?', options: ['Fish', 'Whale', 'Frog', 'Lizard'], correctIndex: 1, emoji: '🐋' },
        { question: 'Is a penguin a bird or fish?', options: ['Fish', 'Bird', 'Mammal', 'Reptile'], correctIndex: 1, emoji: '🐧' },
        { question: 'Which animal is a fish?', options: ['Dolphin', 'Shark', 'Whale', 'Seal'], correctIndex: 1, emoji: '🦈' },
        { question: 'Which is an arachnid?', options: ['Ant', 'Spider', 'Bee', 'Beetle'], correctIndex: 1, emoji: '🕷️' },
        { question: 'Is a bat a bird or mammal?', options: ['Bird', 'Mammal', 'Reptile', 'Insect'], correctIndex: 1, emoji: '🦇' },
        { question: 'Which animal is a reptile?', options: ['Frog', 'Crocodile', 'Fish', 'Bird'], correctIndex: 1, emoji: '🐊' },
        { question: 'Which is an insect?', options: ['Worm', 'Grasshopper', 'Spider', 'Crab'], correctIndex: 1, emoji: '🦗' },
        { question: 'Which animal gives milk?', options: ['Snake', 'Cow', 'Lizard', 'Fish'], correctIndex: 1, emoji: '🐄' },
        { question: 'Is a turtle warm-blooded or cold-blooded?', options: ['Warm-blooded', 'Cold-blooded', 'Both', 'Neither'], correctIndex: 1, emoji: '🐢' },
        { question: 'Which is a bird?', options: ['Lizard', 'Parrot', 'Frog', 'Fish'], correctIndex: 1, emoji: '🦜' },
        { question: 'Which animal lives in water and breathes air?', options: ['Fish', 'Whale', 'Frog', 'Snake'], correctIndex: 1, emoji: '🐋' },
        { question: 'Which is an amphibian?', options: ['Snake', 'Newt', 'Turtle', 'Lizard'], correctIndex: 1, emoji: '🦎' },
        { question: 'How do insects breathe?', options: ['Lungs', 'Gills', 'Spiracles', 'Nose'], correctIndex: 2, emoji: '🐛' },
        { question: 'Which animal has feathers?', options: ['Bat', 'Bird', 'Lizard', 'Frog'], correctIndex: 1, emoji: '🪶' },
        { question: 'Which is a cold-blooded animal?', options: ['Dog', 'Lizard', 'Cat', 'Human'], correctIndex: 1, emoji: '🦎' },
        { question: 'Which animal has six legs?', options: ['Spider', 'Ant', 'Crab', 'Worm'], correctIndex: 1, emoji: '🐜' },
        { question: 'Is a goldfish a reptile or fish?', options: ['Reptile', 'Fish', 'Amphibian', 'Mammal'], correctIndex: 1, emoji: '🐠' },
        { question: 'Which animal is a crustacean?', options: ['Ant', 'Crab', 'Spider', 'Bee'], correctIndex: 1, emoji: '🦀' }
      ];
      return <QuizTemplate questions={qs} title="🐾 Animal Classification" pageSize={5} />;
    }

    /* ========== PRIMARY GEOGRAPHY ========== */
    case 'country-flags': {
      if (showIntro) {
        return (
          <QuizIntro
            title="🏳️ Country Flags"
            emoji="🏳️"
            content={[
              "Every country in the world has its own special flag! A flag is like a country's symbol — it represents the people, history, and values of that nation. No two flags are exactly the same.",
              "Flags use different colors, shapes, and symbols that each have meanings. For example, green often represents nature, blue represents the ocean or sky, and red can represent courage or sacrifice. Some flags have stripes, stars, or crescent moons!",
              "Study the flags below carefully, then test your knowledge in the quiz!"
            ]}
            referenceTitle="🌍 World Flags — Memorize Them!"
            referenceList={[
              { image: 'https://flagcdn.com/80x60/in.png', label: 'India' },
              { image: 'https://flagcdn.com/80x60/us.png', label: 'USA' },
              { image: 'https://flagcdn.com/80x60/jp.png', label: 'Japan' },
              { image: 'https://flagcdn.com/80x60/gb.png', label: 'UK' },
              { image: 'https://flagcdn.com/80x60/fr.png', label: 'France' },
              { image: 'https://flagcdn.com/80x60/br.png', label: 'Brazil' },
              { image: 'https://flagcdn.com/80x60/au.png', label: 'Australia' },
              { image: 'https://flagcdn.com/80x60/de.png', label: 'Germany' },
              { image: 'https://flagcdn.com/80x60/ca.png', label: 'Canada' },
              { image: 'https://flagcdn.com/80x60/it.png', label: 'Italy' },
              { image: 'https://flagcdn.com/80x60/cn.png', label: 'China' },
              { image: 'https://flagcdn.com/80x60/ru.png', label: 'Russia' },
              { image: 'https://flagcdn.com/80x60/mx.png', label: 'Mexico' },
              { image: 'https://flagcdn.com/80x60/za.png', label: 'South Africa' },
              { image: 'https://flagcdn.com/80x60/kr.png', label: 'South Korea' },
              { image: 'https://flagcdn.com/80x60/eg.png', label: 'Egypt' },
              { image: 'https://flagcdn.com/80x60/ng.png', label: 'Nigeria' },
              { image: 'https://flagcdn.com/80x60/ar.png', label: 'Argentina' },
              { image: 'https://flagcdn.com/80x60/tr.png', label: 'Turkey' },
              { image: 'https://flagcdn.com/80x60/th.png', label: 'Thailand' },
              { image: 'https://flagcdn.com/80x60/nz.png', label: 'New Zealand' },
              { image: 'https://flagcdn.com/80x60/se.png', label: 'Sweden' },
              { image: 'https://flagcdn.com/80x60/gr.png', label: 'Greece' },
              { image: 'https://flagcdn.com/80x60/ch.png', label: 'Switzerland' },
              { image: 'https://flagcdn.com/80x60/id.png', label: 'Indonesia' }
            ]}
            facts={[
              "Nepal's flag is the only one that isn't a rectangle",
              "Denmark has the oldest flag design still in use (since 1219)",
              "The USA flag has 50 stars, one for each state"
            ]}
            onStart={() => setShowIntro(false)}
          />
        );
      }
      const qs = [
        { question: 'Which country is this?', options: ['India', 'China', 'Japan', 'Nepal'], correctIndex: 0, flag: 'in' },
        { question: 'Which country is this?', options: ['UK', 'Canada', 'USA', 'Australia'], correctIndex: 2, flag: 'us' },
        { question: 'Which country is this?', options: ['China', 'Japan', 'Korea', 'Thailand'], correctIndex: 1, flag: 'jp' },
        { question: 'Which country is this?', options: ['France', 'Germany', 'Italy', 'UK'], correctIndex: 3, flag: 'gb' },
        { question: 'Which country is this?', options: ['France', 'Spain', 'Portugal', 'Belgium'], correctIndex: 0, flag: 'fr' },
        { question: 'Which country is this?', options: ['Argentina', 'Brazil', 'Chile', 'Peru'], correctIndex: 1, flag: 'br' },
        { question: 'Which country is this?', options: ['New Zealand', 'Australia', 'Fiji', 'Papua'], correctIndex: 1, flag: 'au' },
        { question: 'Which country is this?', options: ['Austria', 'Switzerland', 'Germany', 'Netherlands'], correctIndex: 2, flag: 'de' },
        { question: 'Which country is this?', options: ['USA', 'Canada', 'UK', 'Mexico'], correctIndex: 1, flag: 'ca' },
        { question: 'Which country is this?', options: ['Spain', 'Greece', 'Italy', 'Portugal'], correctIndex: 2, flag: 'it' },
        { question: 'Which country is this?', options: ['Japan', 'Korea', 'China', 'Vietnam'], correctIndex: 2, flag: 'cn' },
        { question: 'Which country is this?', options: ['Canada', 'USA', 'Russia', 'Norway'], correctIndex: 2, flag: 'ru' },
        { question: 'Which country is this?', options: ['Spain', 'Mexico', 'Brazil', 'Argentina'], correctIndex: 1, flag: 'mx' },
        { question: 'Which country is this?', options: ['Nigeria', 'Kenya', 'South Africa', 'Egypt'], correctIndex: 2, flag: 'za' },
        { question: 'Which country is this?', options: ['Japan', 'China', 'Korea', 'Thailand'], correctIndex: 2, flag: 'kr' },
        { question: 'Which country is this?', options: ['Morocco', 'Egypt', 'Algeria', 'Tunisia'], correctIndex: 1, flag: 'eg' },
        { question: 'Which country is this?', options: ['Kenya', 'South Africa', 'Nigeria', 'Ghana'], correctIndex: 2, flag: 'ng' },
        { question: 'Which country is this?', options: ['Brazil', 'Chile', 'Argentina', 'Peru'], correctIndex: 2, flag: 'ar' },
        { question: 'Which country is this?', options: ['Greece', 'Turkey', 'Iran', 'Egypt'], correctIndex: 1, flag: 'tr' },
        { question: 'Which country is this?', options: ['Vietnam', 'Thailand', 'Cambodia', 'Laos'], correctIndex: 1, flag: 'th' },
        { question: 'Which country is this?', options: ['Australia', 'New Zealand', 'Fiji', 'Papua'], correctIndex: 1, flag: 'nz' },
        { question: 'Which country is this?', options: ['Norway', 'Finland', 'Sweden', 'Denmark'], correctIndex: 2, flag: 'se' },
        { question: 'Which country is this?', options: ['Italy', 'Greece', 'Spain', 'Turkey'], correctIndex: 1, flag: 'gr' },
        { question: 'Which country is this?', options: ['Austria', 'Germany', 'Switzerland', 'France'], correctIndex: 2, flag: 'ch' },
        { question: 'Which country is this?', options: ['Malaysia', 'Philippines', 'Indonesia', 'Thailand'], correctIndex: 2, flag: 'id' }
      ];
      return <QuizTemplate questions={qs} title="🏳️ Country Flags" pageSize={5} flagMode />;
    }
    case 'indian-states': {
      if (showIntro) {
        return (
          <QuizIntro
            title="🇮🇳 Indian States"
            emoji="🇮🇳"
            content={[
              "India is an amazing country divided into 28 states and 8 union territories! Each state has its own unique culture, language, food, and traditions.",
              "Study the states and their capitals below carefully, then test your knowledge in the quiz!"
            ]}
            referenceTitle="🇮🇳 Indian States & Capitals — Memorize Them!"
            referenceList={[
              { emoji: '🌴', label: 'Thiruvananthapuram', sublabel: 'Kerala' },
              { emoji: '🏜️', label: 'Jaipur', sublabel: 'Rajasthan' },
              { emoji: '🏛️', label: 'Lucknow', sublabel: 'Uttar Pradesh' },
              { emoji: '🍵', label: 'Dispur', sublabel: 'Assam' },
              { emoji: '🌾', label: 'Chandigarh', sublabel: 'Punjab' },
              { emoji: '🌊', label: 'Gandhinagar', sublabel: 'Gujarat' },
              { emoji: '🏙️', label: 'Mumbai', sublabel: 'Maharashtra' },
              { emoji: '👥', label: 'Bhopal', sublabel: 'Madhya Pradesh' },
              { emoji: '🌶️', label: 'Amaravati', sublabel: 'Andhra Pradesh' },
              { emoji: '🗺️', label: 'Panaji', sublabel: 'Goa' },
              { emoji: '🎬', label: 'Chennai', sublabel: 'Tamil Nadu' },
              { emoji: '⛰️', label: 'Shimla', sublabel: 'Himachal Pradesh' },
              { emoji: '🧵', label: 'Bengaluru', sublabel: 'Karnataka' },
              { emoji: '🐯', label: 'Kolkata', sublabel: 'West Bengal' },
              { emoji: '🍚', label: 'Hyderabad', sublabel: 'Telangana' },
              { emoji: '📚', label: 'Patna', sublabel: 'Bihar' },
              { emoji: '🏞️', label: 'Ranchi', sublabel: 'Jharkhand' },
              { emoji: '💃', label: 'Bhubaneswar', sublabel: 'Odisha' },
              { emoji: '❄️', label: 'Srinagar', sublabel: 'Jammu & Kashmir' },
              { emoji: '🌸', label: 'Dehradun', sublabel: 'Uttarakhand' },
              { emoji: '🏔️', label: 'Gangtok', sublabel: 'Sikkim' },
              { emoji: '🌿', label: 'Shillong', sublabel: 'Meghalaya' },
              { emoji: '🦁', label: 'Raipur', sublabel: 'Chhattisgarh' },
              { emoji: '🎭', label: 'Imphal', sublabel: 'Manipur' },
              { emoji: '🌾', label: 'Chandigarh', sublabel: 'Haryana' },
              { emoji: '🏜️', label: 'Aizawl', sublabel: 'Mizoram' },
              { emoji: '🌺', label: 'Agartala', sublabel: 'Tripura' },
              { emoji: '🏞️', label: 'Kohima', sublabel: 'Nagaland' }
            ]}
            facts={[
              "India has 28 states and 8 union territories",
              "Kerala has the highest literacy rate at over 96%",
              "Rajasthan is India's largest state by area",
              "India has 22 official languages"
            ]}
            onStart={() => setShowIntro(false)}
          />
        );
      }
      const qs = [
        { question: 'Which state is known as "God\'s Own Country"?', options: ['Goa', 'Kerala', 'Rajasthan', 'Gujarat'], correctIndex: 1, emoji: '🌴' },
        { question: 'Which is the largest state by area?', options: ['MP', 'Rajasthan', 'UP', 'Maharashtra'], correctIndex: 1, emoji: '🗺️' },
        { question: 'Taj Mahal is in which state?', options: ['Rajasthan', 'UP', 'MP', 'Bihar'], correctIndex: 1, emoji: '🏛️' },
        { question: 'Which state is famous for tea?', options: ['Assam', 'Punjab', 'Haryana', 'UP'], correctIndex: 0, emoji: '🍵' },
        { question: 'Which state is known as "Land of Five Rivers"?', options: ['Haryana', 'Punjab', 'Gujarat', 'Rajasthan'], correctIndex: 1, emoji: '🌾' },
        { question: 'Which state has the most coastline?', options: ['Kerala', 'Tamil Nadu', 'Gujarat', 'Maharashtra'], correctIndex: 2, emoji: '🌊' },
        { question: 'Which state is known for its backwaters?', options: ['Goa', 'Karnataka', 'Kerala', 'Tamil Nadu'], correctIndex: 2, emoji: '🚤' },
        { question: 'Jaipur is the capital of which state?', options: ['UP', 'Gujarat', 'Rajasthan', 'MP'], correctIndex: 2, emoji: '🏰' },
        { question: 'Which state is the most populous?', options: ['Bihar', 'Maharashtra', 'UP', 'West Bengal'], correctIndex: 2, emoji: '👥' },
        { question: 'Which state is known as "Pink City" state?', options: ['Gujarat', 'Rajasthan', 'Madhya Pradesh', 'Punjab'], correctIndex: 1, emoji: '🏙️' },
        { question: 'Which state is famous for spices?', options: ['Kerala', 'Punjab', 'Haryana', 'Bihar'], correctIndex: 0, emoji: '🌶️' },
        { question: 'Which is the smallest state by area?', options: ['Goa', 'Sikkim', 'Mizoram', 'Tripura'], correctIndex: 0, emoji: '🗺️' },
        { question: 'Which state has Mumbai as its capital?', options: ['Gujarat', 'Maharashtra', 'Goa', 'Karnataka'], correctIndex: 1, emoji: '🏙️' },
        { question: 'Which state is known for Bollywood?', options: ['Delhi', 'Maharashtra', 'UP', 'Rajasthan'], correctIndex: 1, emoji: '🎬' },
        { question: 'Which state is the "Land of the Gods"?', options: ['Himachal Pradesh', 'Uttarakhand', 'Jammu & Kashmir', 'Sikkim'], correctIndex: 1, emoji: '⛰️' },
        { question: 'Which state is known for silk?', options: ['Karnataka', 'Punjab', 'Haryana', 'Bihar'], correctIndex: 0, emoji: '🧵' },
        { question: 'Which state has the most tiger reserves?', options: ['MP', 'Maharashtra', 'Karnataka', 'Tamil Nadu'], correctIndex: 0, emoji: '🐯' },
        { question: 'Which state is called "Rice Bowl of India"?', options: ['Punjab', 'Andhra Pradesh', 'Tamil Nadu', 'Kerala'], correctIndex: 1, emoji: '🍚' },
        { question: 'Which state has the highest literacy rate?', options: ['Kerala', 'Tamil Nadu', 'Goa', 'Himachal Pradesh'], correctIndex: 0, emoji: '📚' },
        { question: 'Which state is famous for IT industry?', options: ['Tamil Nadu', 'Karnataka', 'Telangana', 'Both B and C'], correctIndex: 3, emoji: '💻' },
        { question: 'Which state has the most rivers?', options: ['Kerala', 'West Bengal', 'UP', 'Assam'], correctIndex: 2, emoji: '🏞️' },
        { question: 'Which state is known for its deserts?', options: ['Gujarat', 'Rajasthan', 'MP', 'Maharashtra'], correctIndex: 1, emoji: '🏜️' },
        { question: 'Which state has Kolkata as its capital?', options: ['Bihar', 'Odisha', 'West Bengal', 'Jharkhand'], correctIndex: 2, emoji: '🏙️' },
        { question: 'Which state is famous for dances?', options: ['UP', 'Rajasthan', 'Maharashtra', 'All of these'], correctIndex: 3, emoji: '💃' },
        { question: 'Which state has the most national parks?', options: ['MP', 'Maharashtra', 'Assam', 'Andhra Pradesh'], correctIndex: 0, emoji: '🏞️' }
      ];
      return <QuizTemplate questions={qs} title="🇮🇳 Indian States" pageSize={5} />;
    }

    /* ========== FUN LEARNING GAMES ========== */
    case 'snake-math':
      return <RedirectGame to="/games" title="Snake Math" />;
    case 'memory-match':
      return <RedirectGame to="/games" title="Memory Match" />;
    case 'tic-tac-toe-ai': return <TicTacToeAI />;
    case 'chess-kids': return <ChessKids />;
    case 'game-2048-kids':
      return <RedirectGame to="/games" title="2048" />;
    case 'connect-four': return <ConnectFour />;
    case 'simon-says-kids':
      return <RedirectGame to="/games" title="Simon Says" />;
    case 'whack-mole-kids':
      return <RedirectGame to="/games" title="Whack a Mole" />;
    case 'maze-escape': return <MazeEscape />;
    case 'spot-difference': return <SpotDifference />;

    /* ========== INTERACTIVE ACTIVITIES ========== */
    case 'build-words': return <BuildWords />;
    case 'arrange-sentences': return <ArrangeSentences />;
    case 'emoji-story': return <EmojiStory />;

    default:
      return (
        <div className="activity-page" style={{ justifyContent: 'center', alignItems: 'center', display: 'flex', flexDirection: 'column', minHeight: 300 }}>
          <p style={{ color: '#94a3b8', fontSize: 16 }}>Activity not found.</p>
          <button className="back-btn" style={{ marginTop: 16 }} onClick={() => navigate('/kids')}>Back to Kids</button>
        </div>
      );
    }
  };

  return (
    <>
      <div style={{ padding: '12px 16px 0', maxWidth: 600, margin: '0 auto' }}>
        <button className="back-btn" onClick={() => navigate('/kids')}>←</button>
      </div>
      <Suspense fallback={
        <div className="activity-page" style={{ justifyContent: 'center', alignItems: 'center', display: 'flex', minHeight: 300 }}>
          <p style={{ color: '#94a3b8' }}>Loading...</p>
        </div>
      }>
        {renderContent()}
      </Suspense>
    </>
  );
}
