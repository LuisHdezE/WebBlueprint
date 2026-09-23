import { ComposerExportPanel } from '@/export/ComposerExportPanel';
import { TemplateComposerPage } from '@/pages/TemplateComposerPage';

export function TemplateComposerExportPage() {
  return (
    <>
      <TemplateComposerPage />
      <div className="mx-auto mt-4 max-w-[1500px]">
        <ComposerExportPanel />
      </div>
    </>
  );
}
