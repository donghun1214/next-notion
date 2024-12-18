
"use client";

import { MDXEditor, MDXEditorMethods, headingsPlugin, listsPlugin, tablePlugin, markdownShortcutPlugin } from "@mdxeditor/editor";
import { FC, useRef, useEffect } from "react";


/**
 * Extend this Component further with the necessary plugins or props you need.
 * proxying the ref is necessary. Next.js dynamically imported components don't support refs.
 */
const Editor = ({ markdown, onChange, id }) => {
  const editorRef = useRef(null)
  const handleContentChange = (markdown) => {
    onChange(markdown);
  }
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.setMarkdown(markdown);
    }
  }, [markdown])  
  return (
    <MDXEditor
      key={id}
      onChange={handleContentChange}
      ref={editorRef}
      markdown={markdown}
      plugins={[headingsPlugin(), listsPlugin(), tablePlugin(), markdownShortcutPlugin()]}
    />
  );
};

export default Editor;
