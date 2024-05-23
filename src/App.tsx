import React, { useEffect, useState } from 'react';
import FileDrop from './components/FileDrop';

const App: React.FC = () => {
  const [extractedText, setExtractedText] = useState<string>('');
  const [search, setSearch] = useState<string>('');
  const [displayedText, setDisplayedText ] = useState<string>('');

  const handleTextExtracted = (text: string) => {
    console.log('Extracted Text:', text);
    setExtractedText(text);
  };

  useEffect(()=>setDisplayedText(extractedText),[extractedText])

  const highlightWord = (text:string, word:string) => {
    const regex = new RegExp(`\\w*${word}\\w*`, 'gi');
    return text.replace(regex, `<U>${word}</U>`)
  };

  const handleDocSearch = () => {
    const highlightedContent = highlightWord(extractedText, search);
    setDisplayedText(highlightedContent)
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{marginBottom: 0}}>File Drop with Text Recognition and Search</h1>
      <h3 style={{fontStyle: 'italic', marginTop: "5px"}}>proof of concept</h3>
      <FileDrop onTextExtracted={handleTextExtracted} />
      <div style={{ padding: '20px', display: "flex" }}>
      <input
      onChange={(e)=>{setSearch(e.target.value)}}/>
      <button onClick={()=>{handleDocSearch()}}> search</button>
      </div>
      {extractedText && (
        <div style={{ marginTop: '20px' }}>
          <h2>Extracted Text:</h2>
          <pre dangerouslySetInnerHTML={{ __html: displayedText }}></pre>
        </div>
      )}
    </div>
  );
};

export default App;