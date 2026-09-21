export type ExportProjectFile = {
  path: string;
  content: string;
};

export type ExportProject = {
  rootName: string;
  files: readonly ExportProjectFile[];
};
