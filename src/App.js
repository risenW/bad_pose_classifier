import { useEffect, useRef, useState } from "react";
import ml5 from "ml5";
import { useInterval } from "react-use"
import "./App.css";

let classifier;

function App() {
  const videoRef = useRef();
  const [start, setStart] = useState(false);
  const [result, setResult] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    classifier = ml5.imageClassifier("./model/model.json", () => {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: false })
        .then((stream) => {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
          setLoaded(true);
        });
    });
  }, []);

  useInterval(() => {
    if (classifier && start) {
      classifier.classify(videoRef.current, (error, results) => {
        if (error) {
          console.error(error);
          return;
        }
        const label1 = results[0].label
        const score1 = results[0].confidence
        const label2 = results[1].label
        const score2 = results[1].confidence

        if (score1 > score2) {
          setResult([label1, score1]);
        } else {
          setResult([label2, score2]);
        }
      });
    }
  }, 500, [start]);

  const toggle = () => {
    setStart(!start);
    setResult([]);
  }

  return (
    <div style={{ margin: "20px" }}>
      <div className="capture">
        <video
          ref={videoRef}
          style={{ transform: "scale(-1, 1)" }}
          width="300"
          height="150"
        />
      </div>
      <div style={{ padding: "5px" }}>
        {result[0]}
      </div>
      <div className="result">
        {loaded && (
          <button style={{ padding: "5px" }} onClick={() => toggle()}>
            {start ? "Stop" : "Start"}
          </button>
        )}


      </div>
    </div>
  );
}

export default App;