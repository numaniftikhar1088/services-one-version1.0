CREATE TABLE [dbo].[tblLabUsers] (
    [LabId]       INT                                                NOT NULL,
    [IsActive]    BIT                                                CONSTRAINT [DF_tblLabUsers_IsActive] DEFAULT ((1)) NOT NULL,
    [IsDefault]   BIT                                                CONSTRAINT [DF_tblLabUsers_IsDefault] DEFAULT ((0)) NULL,
    [UserId]      NVARCHAR (200)                                     NOT NULL,
    [IsDeleted]   BIT                                                DEFAULT ((0)) NOT NULL,
    [PeriodEnd]   DATETIME2 (7) GENERATED ALWAYS AS ROW END HIDDEN   DEFAULT ('9999-12-31T23:59:59.9999999') NOT NULL,
    [PeriodStart] DATETIME2 (7) GENERATED ALWAYS AS ROW START HIDDEN DEFAULT ('0001-01-01T00:00:00.0000000') NOT NULL,
    CONSTRAINT [PK_tblTenantUsers] PRIMARY KEY CLUSTERED ([LabId] ASC, [UserId] ASC),
    CONSTRAINT [FK_tblLabUsers_tblLab] FOREIGN KEY ([LabId]) REFERENCES [dbo].[tblLabs] ([LabId]),
    CONSTRAINT [FK_tblTenantUsers_tblUser] FOREIGN KEY ([UserId]) REFERENCES [dbo].[tblUser] ([ID]),
    PERIOD FOR SYSTEM_TIME ([PeriodStart], [PeriodEnd])
)
WITH (SYSTEM_VERSIONING = ON (HISTORY_TABLE=[dbo].[tblLabUsersHistory], DATA_CONSISTENCY_CHECK=ON));

