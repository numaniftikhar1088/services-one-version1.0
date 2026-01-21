CREATE TABLE [dbo].[tblLabAssignmentGroups] (
    [ID]              INT IDENTITY (1, 1) NOT NULL,
    [LabAssignmentID] INT NOT NULL,
    [GroupID]         INT NOT NULL,
    CONSTRAINT [PK_tblLabAssignmentGroups] PRIMARY KEY CLUSTERED ([ID] ASC),
    CONSTRAINT [FK_tblLabAssignmentGroups_tblCompendiumGroups] FOREIGN KEY ([GroupID]) REFERENCES [dbo].[tblCompendiumGroups] ([ID]),
    CONSTRAINT [FK_tblLabAssignmentGroups_tblLabAssignment] FOREIGN KEY ([LabAssignmentID]) REFERENCES [dbo].[tblLabAssignment] ([ID])
);

