import React, { useState, useCallback, useEffect } from "react";
import "./App.css";
import { Puzzle } from "./components/Puzzle/";
import { PuzzleContainer } from "./components/PuzzleContainer/";
import {
  Sidebar,
  SidebarContents,
  SidebarIntroduction,
} from "./components/Sidebar/";
import { Complete } from "./components/Complete";
import { useSceneManager } from "./hooks/useSceneManager";
import { useStory } from "./hooks/useStory";

const App = () => {
  // Whether or not to show the intro screen
  const [introduction, setIntroduction] = useState(true);

  // Whether or not to show the final screen
  const [complete, setComplete] = useState(false);

  const [
    chapters,
    currentLevel,
    goToNextLevel,
    setLevel,
    chapterIndex, // TODO: Use level ids instead of indices
    levelIndex,
  ] = useStory();

  const [isMatch, isDirty, updateScene, setScene] = useSceneManager(
    currentLevel.boxes,
    currentLevel.goal
  );

  useEffect(() => {
    setRng(Math.random().toString(36).substring(7));
    setScene(currentLevel.boxes, currentLevel.goal);
  }, [currentLevel, setScene]);

  // A random string to accompany keys
  const [rng, setRng] = useState(Math.random().toString(36).substring(7));

  // What to do when a user submits a solution
  const handleLevelSubmit = useCallback(() => {
    if (introduction) {
      setIntroduction(false);
      return;
    }

    // If it's a win, proceed
    if (isMatch) {
      if (!goToNextLevel()) {
        setComplete(true);
      }
    }
  }, [isMatch, goToNextLevel, introduction]);

  const handleReset = () => {
    setScene(currentLevel.boxes, currentLevel.goal);
    setRng(Math.random().toString(36).substring(7));
  };

  const getSubmitText = () => {
    if (introduction) {
      return "Begin";
    }
    if (complete) {
      return null;
    }
    return "Submit";
  };

  const getHeaderText = () => {
    if (introduction) {
      return null;
    }
    if (complete) {
      return null;
    }
    return chapters[chapterIndex].funnyTitle || "";
  };

  const getSubText = () => {
    if (introduction) {
      return 'A CSS puzzle game by <a href="https://www.abefehr.com/">Abe Fehr</a>';
    }
    return chapters[chapterIndex].funnySubtitle || "";
  };

  return (
    <main>
      <Sidebar
        isMatch={introduction || isMatch}
        isDirty={isDirty}
        onReset={handleReset}
        onSubmit={handleLevelSubmit}
        submitText={getSubmitText()}
        headerText={getHeaderText()}
        isIntroduction={introduction}
        subText={getSubText()}
      >
        {introduction && <SidebarIntroduction />}
        {!introduction && !complete && <SidebarContents level={currentLevel} />}
      </Sidebar>
      <PuzzleContainer padding={!complete}>
        {!introduction && !complete && (
          <>
            <div style={{ position: "absolute", top: 20, left: 20 }}>
              <label style={{ fontSize: "14px" }}>Level select: </label>
              <select
                onChange={(e) =>
                  setLevel(...e.target.value.split("-").map((v) => Number(v)))
                }
                value={`${chapterIndex}-${levelIndex}`}
              >
                {chapters.map((chapter, i) => (
                  <>
                    {chapter.levels.length && (
                      <optgroup key={i} label={chapter.title}>
                        {chapter.levels.map((lvl, j) => (
                          <option key={`${i}-${j}`} value={`${i}-${j}`}>
                            {`Puzzle ${j + 1}${
                              lvl.category ? ` - ${lvl.category}` : ""
                            }`}
                          </option>
                        ))}
                      </optgroup>
                    )}
                  </>
                ))}
              </select>
            </div>
            <Puzzle rng={rng} level={currentLevel} onInput={updateScene} />
          </>
        )}
        {complete && <Complete />}
        {!introduction && !complete && (
          <div className="Puzzle__instruction">
            Drag and/or resize the boxes above to match the given HTML+CSS in
            the left sidebar
          </div>
        )}
      </PuzzleContainer>
    </main>
  );
};

export default App;
