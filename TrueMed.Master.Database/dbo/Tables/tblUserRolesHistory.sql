CREATE TABLE [dbo].[tblUserRolesHistory] (
    [UserId]      NVARCHAR (200) NOT NULL,
    [LabId]       INT            NOT NULL,
    [RoleId]      INT            NOT NULL,
    [PeriodEnd]   DATETIME2 (7)  NOT NULL,
    [PeriodStart] DATETIME2 (7)  NOT NULL
);


GO
CREATE CLUSTERED INDEX [ix_tblUserRolesHistory]
    ON [dbo].[tblUserRolesHistory]([PeriodEnd] ASC, [PeriodStart] ASC) WITH (DATA_COMPRESSION = PAGE);

