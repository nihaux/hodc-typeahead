import React from 'react';
import { getVisibleSelectionRect } from 'draft-js';

/*
 * Higher Order Draft Component, allow to have typeahead feature on a draftjs editor
 */
const withTypeahead = ({
  /*
   * string that when found in text will trigger the search with what comes after
   */
  startToken,
  /*
   * function to make suggestion from text
   * IN:
   *  - the string found after the startToken
   * OUT:
   *  - an array of suggestion
   */
  search,
  /*
   * The function which will be called when user click on suggestion or press enter
   * IN:
   *  - selected suggestion
   *  - current editor state
   *  - text to replace
   * OUT:
   *  - new editor state
   */
  onClick,
  /*
   * React component that will be use to render each suggestion
   */
  renderSuggest,
  /*
   * minimum length for the string after startToken to trigger the search
   */
  minLength = 2,
  /*
   * should a whitespace break the search string
   */
  breakOnWhitespace = false,
}) => (Editor) => {
  class TypeaheadEditor extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        showModal: false,
      };
    }

    componentDidMount() {
      document.addEventListener('keydown', this.handleKeyDown, true);
    }

    componentWillUnmount() {
      document.removeEventListener('keydown', this.handleKeyDown, true);
    }

    componentWillReceiveProps(nextProps) {
      const sel = nextProps.editorState.getSelection();
      if (!sel.isCollapsed() || !sel.hasFocus) {
        return;
      }

      this.setState({
        showModal: false,
      });
      const startKey = sel.getStartKey();
      const currentContent = nextProps.editorState.getCurrentContent();
      const block = currentContent.getBlockForKey(startKey);

      if (!block.text) {
        return;
      }

      const selOffset = sel.getStartOffset();
      const text = block.getText();
      const firstTokenOffset = text.lastIndexOf(startToken, selOffset);

      if (firstTokenOffset === -1) {
        return;
      }
      const textToReplace = text.slice(firstTokenOffset, selOffset);
      const searchString = textToReplace.slice(startToken.length);
      if (searchString.length <= minLength) {
        return;
      }
      if (breakOnWhitespace === true) {
        const firstWhitespaceOffset = text.lastIndexOf(' ', selOffset - 1);
        if (firstTokenOffset < firstWhitespaceOffset) {
          return;
        }
      }
      const suggests = search(searchString);
      if (!suggests || suggests.length === 0) {
        return;
      }
      const selRect = getVisibleSelectionRect(window);
      if (!selRect) {
        return;
      }
      // very very hugly hack for header-two
      const top = block.type === 'header-two' ? selRect.bottom : selRect.top;
      const left = selRect.left - searchString.length - startToken.length;
      this.setState({
        showModal: true,
        suggests,
        idx: 0,
        style: {
          position: 'absolute',
          top,
          left,
          width: '300px',
          listStyleType: 'none',
          border: '1px black solid',
          zIndex: 10000,
          background: 'white',
          padding: 0,
        },
        textToReplace,
      });
    }


    onClick = (suggest) => {
      this.setState({
        showModal: false,
      });
      if (onClick) {
        const newEditorState = onClick(
          suggest,
          this.props.editorState,
          this.state.textToReplace,
        );
        if (newEditorState) {
          this.props.onChange(newEditorState);
        }
      }
    };

    handleKeyDown = (event) => {
      if (!this.state.showModal) {
        return;
      }
      switch (event.key) {
        case 'ArrowDown': {
          event.preventDefault();
          if (this.state.idx === this.state.suggests.length) {
            this.setState({
              idx: 1,
            });
            return;
          }
          this.setState({
            idx: this.state.idx + 1,
          });
          break;
        }
        case 'ArrowUp': {
          event.preventDefault();
          if (this.state.idx === 1) {
            this.setState({
              idx: this.state.suggests.length,
            });
            return;
          }
          this.setState({
            idx: this.state.idx - 1,
          });
          break;
        }
        case 'Enter': {
          const currentSuggest = this.state.suggests[this.state.idx - 1];
          if (currentSuggest) {
            event.preventDefault();
            event.stopPropagation();
            this.onClick(currentSuggest);
          }
          break;
        }
        case 'Escape': {
          this.setState({
            showModal: false,
          });
          break;
        }

        default:
          break;
      }
    };


    render = () => (
      <div>
        <ul
          style={
            Object.assign(
              {
                display: this.state.showModal ? 'block' : 'none',
              },
              this.state.style,
            )
          }
        >
          {this.state.suggests && this.state.suggests.map((o, idx) => (
            <li
              key={o.id}
              onClick={() => this.onClick(o)}
              style={{
                backgroundColor: this.state.idx === idx + 1 ? 'grey' : 'white',
              }}
            >
              {renderSuggest(o)}
            </li>
          ))}
        </ul>
        <Editor {...this.props} />
      </div>
    );
  }

  TypeaheadEditor.propTypes = {
    editorState: React.PropTypes.obj.isRequired,
    onChange: React.PropTypes.func.isRequired,
  };
};

export default withTypeahead;
