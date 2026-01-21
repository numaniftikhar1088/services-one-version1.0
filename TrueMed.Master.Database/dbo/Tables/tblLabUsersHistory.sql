CREATE TABLE [dbo].[tblLabUsersHistory] (
    [LabId]       INT            NOT NULL,
    [IsActive]    BIT            NOT NULL,
    [IsDefault]   BIT            NULL,
    [UserId]      NVARCHAR (200) NOT NULL,
    [IsDeleted]   BIT            NOT NULL,
    [PeriodEnd]   DATETIME2 (7)  NOT NULL,
    [PeriodStart] DATETIME2 (7)  NOT NULL
);


GO
CREATE CLUSTERED INDEX [ix_tblLabUsersHistory]
    ON [dbo].[tblLabUsersHistory]([PeriodEnd] ASC, [PeriodStart] ASC) WITH (DATA_COMPRESSION = PAGE);

