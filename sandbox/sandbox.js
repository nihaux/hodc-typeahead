import React from 'react';
import ReactDOM from 'react-dom';
import { Editor, EditorState } from 'draft-js';
import { replaceText, withTypeahead } from '../src';
import countries from './countries';



const searchCountries = (string) =>
  countries.filter((country) => country.name.toLowerCase().indexOf(string) !== -1 );

const displayCountry = (country) => <span>{country.name} ({country.code})</span>;

const replaceWithCode = (country, editorState, textToReplace) =>
  replaceText(country.code, editorState, textToReplace);

const TypeaheadEditor = withTypeahead({
  startToken: "@",
  minLength: 0,
  search: searchCountries,
  renderSuggest: displayCountry,
  onClick: replaceWithCode,
})(Editor);

class Sandbox extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      editorState: EditorState.createEmpty()
    };
  }
  onChange = (editorState) => {
    this.setState({
      editorState,
    });
  };
  render = () => (
    <div>
      <h1>Typeahead Editor Sandbox</h1>
      <p>
        Type @ and some characters to search a country.<br/>
        on click, the country code will be inserted.<br/>
        You can use keyboard to navigate the typeahead.
      </p>
      <p>
        <TypeaheadEditor onChange={this.onChange} editorState={this.state.editorState} />
      </p>
    </div>
  );
}

ReactDOM.render(
  <Sandbox />,
  document.getElementById('sandbox'),
);