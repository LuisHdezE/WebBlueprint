import { useState } from 'react';
import { readProjectManifest } from '@/composer/project.storage';
import { ComposerExportPanel } from '@/export/ComposerExportPanel';
import { TemplateComposerPage } from '@/pages/TemplateComposerPage';

export function TemplateComposerExportPage() {
  const [project, setProject] = useState(readProjectManifest);
  return (
    <>
      <TemplateComposerPage project={project} setProject={setProject} />
      <div className="mx-auto mt-4 max-w-[1500px]">
        <ComposerExportPanel project={project} />
      </div>
    </>
  );
}
