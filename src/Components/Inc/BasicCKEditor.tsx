import {CKEditor} from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

import "./BasicCKEditor.css"

const BasicCKEditor = (props: any) => {
   
    return (
        <CKEditor
        editor={ ClassicEditor }
        data={props.data}
        config={{
          toolbar: {
            items: [
              'heading', '|',
              'fontfamily', 'fontsize', '|',
              'alignment', '|',
              'fontColor', 'fontBackgroundColor', '|',
              'bold', 'italic', 'strikethrough', 'underline', 'subscript', 'superscript', '|',
              'link', '|',
              'outdent', 'indent', '|',
              'bulletedList', 'numberedList', 'todoList', '|',
              'code', 'codeBlock', '|',
              'insertTable', '|',
              'blockQuote', '|',
              'undo', 'redo'
            ],
            shouldNotGroupWhenFull: true,
          },
        }}
         onChange={ ( event:any, editor:any ) => {
         props.setEditorData(editor.getData());                  
        } 
      }                
    />
    )
}
const extractContent = (s:any) =>{
  var span = document.createElement('span');
  span.innerHTML = s;
  return span.textContent || span.innerText;
};

export { BasicCKEditor, extractContent, }