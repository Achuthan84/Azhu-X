import { createContext, useState } from "react";
import run from "../Config/Gemini";

export const Context = createContext();

const ContextProvider = ({ children }) => {
    const [input, setInput] = useState("");
    const [recentPrompt, setRecentPrompt] = useState("");
    const [prevPrompt, setPrevPrompt] = useState([]);
    const [showResult, setShowResult] = useState(false);
    const [loading, setLoading] = useState(false);
    const [resultData, setResultData] = useState("");
    const delayPara = (index, nextWord) => {
        setTimeout(function () {
            setResultData(prev => prev + nextWord)
        }, 75 * index)
    };
    const newChat = () => {
        setLoading(false)
        setShowResult(false)
    }

    const onSent = async (prompt) => {
        setResultData("");
        setLoading(true);
        setShowResult(true);
        let response;
        if (prompt !== undefined) {
            response = await run(prompt)
            setRecentPrompt(prompt)
        }
        else {
            setPrevPrompt(prev => [...prev, input]);
            setRecentPrompt(input)
            response = await run(input);
        }
        let formattedResponse = response.replace(/\*\*(.*?)\*\*/g, "<b>$1</b>").replace(/\*/g, "<br/>");
        let newresponseArray = formattedResponse.split(" ")
        for (let i = 0; i < newresponseArray.length; i++) {
            const nextWord = newresponseArray[i];
            delayPara(i, nextWord + " ")
        }
        setLoading(false);
        setInput("");
    };

    return (
        <Context.Provider value={{ prevPrompt, input, setInput, recentPrompt, showResult, loading, resultData, onSent,newChat}}>
            {children}
        </Context.Provider>
    );
};

export default ContextProvider;
