import { useEffect } from 'react';

function useDocumentTitle(title: string, description: string) {
  useEffect(() => {
    document.title = title;
    
    const descriptionMeta = document.querySelector('meta[name="description"]');
    if (descriptionMeta) {
      descriptionMeta.setAttribute('content', description);
    }

  }, [title, description]);
}

export default useDocumentTitle;