﻿import "./App.css";
import { feedbackMachine } from "./feedbackMachine";
import { useMachine } from "@xstate/react";
import { createBrowserInspector } from "@statelyai/inspect";
import { cartMachine } from "./cartMachine";

const { inspect } = createBrowserInspector({
  // Comment out the line below to start the inspector
  autoStart: false,
});

function Feedback() {
  const [state, send] = useMachine(feedbackMachine, {
    inspect,
  });

  if (state.matches("closed")) {
    return (
      <div>
        <em>Feedback form closed.</em>
        <br />
        <button
          onClick={() => {
            send({ type: "restart" });
          }}
        >
          Provide more feedback
        </button>
      </div>
    );
  }

  return (
    <div className="feedback">
      <button
        className="close-button"
        onClick={() => {
          send({ type: "close" });
        }}
      >
        Close
      </button>
      {state.matches("prompt") && (
        <div className="step">
          <h2>How was your experience?</h2>
          <button
            className="button"
            onClick={() => send({ type: "feedback.good" })}
          >
            Good
          </button>
          <button
            className="button"
            onClick={() => send({ type: "feedback.bad" })}
          >
            Bad
          </button>
        </div>
      )}

      {state.matches("thanks") && (
        <div className="step">
          <h2>Thanks for your feedback.</h2>
          {state.context.feedback.length > 0 && (
            <p>"{state.context.feedback}"</p>
          )}
        </div>
      )}

      {state.matches("form") && (
        <form
          className="step"
          onSubmit={(ev) => {
            ev.preventDefault();
            send({
              type: "submit",
            });
          }}
        >
          <h2>What can we do better?</h2>
          <textarea
            name="feedback"
            rows={4}
            placeholder="So many things..."
            onChange={(ev) => {
              send({
                type: "feedback.update",
                value: ev.target.value,
              });
            }}
          />
          <button className="button" disabled={!state.can({ type: "submit" })}>
            Submit
          </button>
          <button
            className="button"
            type="button"
            onClick={() => {
              send({ type: "back" });
            }}
          >
            Back
          </button>
        </form>
      )}
    </div>
  );
}

function App() {
  const [state, send, service] = useMachine(cartMachine, {
    actions: {
      purchased: ({ context }) => console.log(context.items.length),
    },
  });

  useEffect(() => {
    const listener = () => console.log("done");
    service.onDone(listener);

    return () => service.off(listener);
  }, []);

  return (
    <div>
      {/* 현재 상태에 대한 텍스트 정보 */}
      <p>{state.value}</p>
      <ul>
        {state.context.items.map((name, i) => (
          <li key={i}>
            {name}
            &nbsp;
            <button onClick={() => send({ type: "REMOVE_ITEM", name })}>
              X
            </button>
          </li>
        ))}
      </ul>
      <button
        onClick={() => send({ type: "ADD_ITEM", item: `item${Date.now()}` })}
      >
        Add Item
      </button>
      &nbsp;&nbsp;
      <button onClick={() => send({ type: "RESET_ITEMS" })}>Reset Item</button>
    </div>
  );
  // return <Feedback />;
}

export default App;