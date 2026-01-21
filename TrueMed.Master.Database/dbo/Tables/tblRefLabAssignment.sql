CREATE TABLE [dbo].[tblRefLabAssignment] (
    [RefLabId]   INT            NOT NULL,
    [LabId]      INT            NOT NULL,
    [LabType]    INT            NOT NULL,
    [CreateDate] DATETIME2 (7)  NOT NULL,
    [CreatedBy]  NVARCHAR (200) NOT NULL,
    [UpdateDate] DATETIME2 (7)  NULL,
    [UpdateBy]   NVARCHAR (200) NULL,
    [STATUS]     INT            NULL,
    CONSTRAINT [PK__tblRefLa__733E4FADFD657A71] PRIMARY KEY CLUSTERED ([RefLabId] ASC, [LabId] ASC)
);

