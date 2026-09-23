import { describe, expect, it } from 'vitest';
import { applyProjectPreset, createDefaultProject, moveProjectView, toggleProjectView } from '@/composer/project.logic';

describe('project composer logic', () => {
  it('applies a preset as an editable view selection', () => {
    const presetProject = applyProjectPreset(createDefaultProject(), 'ecommerce');

    expect(presetProject.presetId).toBe('ecommerce');
    expect(presetProject.views).toContain('/applications/ecommerce/products');
    expect(presetProject.views).toContain('/applications/ecommerce/shop');

    const edited = toggleProjectView(presetProject, '/applications/ecommerce/editor');
    expect(edited.presetId).toBe('ecommerce');
    expect(edited.views).not.toContain('/applications/ecommerce/editor');
  });

  it('keeps the selected view sequence editable', () => {
    let project = createDefaultProject();
    project = toggleProjectView(project, '/applications/contacts');
    project = toggleProjectView(project, '/charts');

    expect(project.views).toEqual(['/dashboard', '/applications/contacts', '/charts']);

    project = moveProjectView(project, '/charts', -1);
    expect(project.views).toEqual(['/dashboard', '/charts', '/applications/contacts']);
  });

  it('blank preset clears the selected views without locking future edits', () => {
    let project = applyProjectPreset(createDefaultProject(), 'blank');
    expect(project.presetId).toBeNull();
    expect(project.views).toEqual([]);

    project = toggleProjectView(project, '/dashboard');
    expect(project.views).toEqual(['/dashboard']);
  });
});
