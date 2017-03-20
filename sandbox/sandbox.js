import React from 'react';
import ReactDOM from 'react-dom';
import { Editor, EditorState, convertFromRaw } from 'draft-js';
import { replaceText, withTypeahead } from '../src';
import countries from './countries';
import content from './content';


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
      editorState: EditorState.createWithContent(convertFromRaw(content)),
    };
  }
  onChange = (editorState) => {
    this.setState({
      editorState,
    });
  };
  render = () => (
    <TypeaheadEditor onChange={this.onChange} editorState={this.state.editorState} />
  );
}

ReactDOM.render(
  <Sandbox />,
  document.getElementById('sandbox'),
);