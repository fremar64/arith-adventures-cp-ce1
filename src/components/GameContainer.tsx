
import React, { useState, useEffect, useRef } from 'react';
import MarbleScene from './MarbleScene';
import SpeechBubble from './SpeechBubble';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import useSpeechSynthesis from '@/hooks/useSpeechSynthesis';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage } from '@react-three/drei';
import TeacherModel from './TeacherModel';

// Game states
enum GameState {
  Introduction,
  CountingRed,
  CountingBlue,
  HiddenCalculation,
  Result,
  NextQuestion,
  FinalScore
}

const GameContainer: React.FC = () => {
  // Game state
  const [gameState, setGameState] = useState<GameState>(GameState.Introduction);
  const [redMarbles, setRedMarbles] = useState(0);
  const [blueMarbles, setBlueMarbles] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [showMarbles, setShowMarbles] = useState(true);
  const [questionCount, setQuestionCount] = useState(0);
  const [score, setScore] = useState(0);
  const [currentMessage, setCurrentMessage] = useState('');

  // Speech synthesis
  const { speak, speaking, supported } = useSpeechSynthesis({
    text: currentMessage,
    onEnd: () => {
      // You can add actions after speech ends here
    }
  });

  // Ref to store if we've already spoken in the current state
  const hasSpokenRef = useRef(false);

  // Generate random number of marbles (1-5 for each color)
  const generateMarbles = () => {
    const red = Math.floor(Math.random() * 5) + 1;
    const blue = Math.floor(Math.random() * 5) + 1;
    setRedMarbles(red);
    setBlueMarbles(blue);
    setShowMarbles(true);
    setUserAnswer('');
    hasSpokenRef.current = false;
  };

  // Handle user input
  const handleAnswerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow numbers
    if (/^\d*$/.test(value)) {
      setUserAnswer(value);
    }
  };

  // Handle user validation
  const handleValidate = () => {
    switch (gameState) {
      case GameState.CountingRed:
        if (parseInt(userAnswer) === redMarbles) {
          setGameState(GameState.CountingBlue);
          setUserAnswer('');
        } else {
          setCurrentMessage("Tu n'as pas bien compté. Recommence.");
        }
        break;
        
      case GameState.CountingBlue:
        if (parseInt(userAnswer) === blueMarbles) {
          setShowMarbles(false);
          setGameState(GameState.HiddenCalculation);
          setUserAnswer('');
        } else {
          setCurrentMessage("Tu n'as pas bien compté. Recommence.");
        }
        break;
        
      case GameState.HiddenCalculation:
        const totalMarbles = redMarbles + blueMarbles;
        if (parseInt(userAnswer) === totalMarbles) {
          setScore(score + 1);
          setCurrentMessage(`Bravo ! Le nombre total de billes est bien ${totalMarbles}. J'ai remis les billes sur le plateau pour que tu puisses vérifier ton calcul en les comptant.`);
          setShowMarbles(true);
        } else {
          setCurrentMessage(`Tu t'es trompé. Le nombre total de billes est ${totalMarbles}. J'ai remis les billes sur le plateau pour que tu puisses compter et comprendre ton erreur.`);
          setShowMarbles(true);
        }
        setGameState(GameState.Result);
        break;
        
      default:
        break;
    }
  };

  // Handle continue button
  const handleContinue = () => {
    if (gameState === GameState.Result) {
      if (questionCount < 4) {
        setQuestionCount(questionCount + 1);
        generateMarbles();
        setGameState(GameState.CountingRed);
      } else {
        setGameState(GameState.FinalScore);
      }
    } else if (gameState === GameState.Introduction) {
      generateMarbles();
      setGameState(GameState.CountingRed);
    }
  };

  // Handle restart game
  const handleRestart = () => {
    setScore(0);
    setQuestionCount(0);
    generateMarbles();
    setGameState(GameState.CountingRed);
  };

  // Update messages based on game state
  useEffect(() => {
    if (hasSpokenRef.current) return;
    
    let message = '';
    
    switch (gameState) {
      case GameState.Introduction:
        message = "Bienvenue dans le jeu d'arithmétique ! Nous allons compter et additionner des billes. Clique sur Commencer quand tu es prêt.";
        break;
        
      case GameState.CountingRed:
        message = "Compte le nombre de billes rouges qu'il y a sur le plateau et écris le nombre que tu as trouvé.";
        break;
        
      case GameState.CountingBlue:
        message = "Compte maintenant le nombre de billes bleues et écris le nombre que tu as trouvé.";
        break;
        
      case GameState.HiddenCalculation:
        message = `Tu as compté ${redMarbles} billes rouges et ${blueMarbles} billes bleues. Je les ai toutes cachées. Est-ce que tu peux trouver le nombre de billes que cela fait en tout ? Réfléchis et écris ce nombre.`;
        break;
        
      case GameState.FinalScore:
        let feedback = '';
        if (score === 5) {
          feedback = "Performance très satisfaisante !";
        } else if (score === 4) {
          feedback = "Performance satisfaisante !";
        } else if (score === 3) {
          feedback = "Performance insuffisante.";
        } else {
          feedback = "Performance très insuffisante.";
        }
        message = `Tu as terminé le jeu avec un score de ${score}/5. ${feedback} Veux-tu réessayer ?`;
        break;
        
      default:
        break;
    }
    
    if (message) {
      setCurrentMessage(message);
      if (supported) {
        hasSpokenRef.current = true;
        speak(message);
      }
    }
  }, [gameState, redMarbles, blueMarbles, score, supported, speak]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left side - Marbles and Input */}
        <div className="flex-1 flex flex-col items-center">
          <div className="w-full">
            <MarbleScene 
              redMarbles={redMarbles} 
              blueMarbles={blueMarbles}
              showMarbles={showMarbles}
            />
          </div>
          
          <div className="mt-6 w-full max-w-sm">
            {(gameState === GameState.CountingRed || 
              gameState === GameState.CountingBlue || 
              gameState === GameState.HiddenCalculation) && (
              <div className="flex items-center gap-4">
                <Input
                  type="text"
                  value={userAnswer}
                  onChange={handleAnswerChange}
                  placeholder="Ta réponse"
                  className="text-lg"
                  autoFocus
                />
                <Button 
                  onClick={handleValidate} 
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Valider
                </Button>
              </div>
            )}
            
            {(gameState === GameState.Introduction || gameState === GameState.Result) && (
              <Button 
                onClick={handleContinue} 
                className="w-full bg-green-600 hover:bg-green-700 text-white"
              >
                {gameState === GameState.Introduction ? 'Commencer' : 'Continuer'}
              </Button>
            )}
            
            {gameState === GameState.FinalScore && (
              <Button 
                onClick={handleRestart} 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                Recommencer
              </Button>
            )}
          </div>
        </div>
        
        {/* Right side - Speech bubble and Teacher */}
        <div className="flex-1 flex flex-col items-center">
          <div className="mb-4 w-full">
            <SpeechBubble text={currentMessage} />
          </div>
          
          <div className="w-full h-80 bg-gray-50 rounded-lg overflow-hidden">
            <Canvas>
              <ambientLight intensity={0.5} />
              <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
              <pointLight position={[-10, -10, -10]} />
              <TeacherModel currentState={gameState} />
              <OrbitControls
                enableZoom={false}
                enablePan={false}
                minPolarAngle={Math.PI / 6}
                maxPolarAngle={Math.PI / 2}
              />
            </Canvas>
          </div>
        </div>
      </div>
      
      {/* Game progress information */}
      <div className="mt-8 text-center">
        {gameState !== GameState.Introduction && gameState !== GameState.FinalScore && (
          <p className="text-gray-700">
            Question {questionCount + 1}/5 | Score actuel: {score}
          </p>
        )}
      </div>
    </div>
  );
};

export default GameContainer;
