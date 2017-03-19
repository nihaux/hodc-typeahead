const replaceText = (replaceWith, entityKey, editorState, textToReplace) => {
  const contentState = editorState.getCurrentContent();
  const selection = editorState.getSelection();
  const entitySelection = selection.set(
    'anchorOffset', selection.getFocusOffset() - textToReplace.length
  );
  const contentStateWithEmoji = Modifier.replaceText(
    contentState,
    entitySelection,
    replaceWith,
    null,
    entityKey,
  );
  const finalContentState = Modifier.insertText(
    contentStateWithEmoji,
    contentStateWithEmoji.getSelectionAfter(),
    ' ',
  );
  const nextEditorState = EditorState.push(
    editorState, finalContentState, 'insert-characters'
  );

  return nextEditorState;
};

export default replaceText;
