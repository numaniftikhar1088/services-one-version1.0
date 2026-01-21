CREATE TABLE [dbo].[tblFacilityUser] (
    [UserId]        NVARCHAR (300) NOT NULL,
    [FacilityId]    INT            NOT NULL,
    [MasterUserID]  NVARCHAR (300) NULL,
    [RefrenceLabID] NVARCHAR (300) NULL,
    [CreatedBy]     NVARCHAR (MAX) NULL,
    [CreatedTime]   DATETIME       CONSTRAINT [DF_tblFacilityUser_CreatedTime] DEFAULT (getdate()) NOT NULL,
    CONSTRAINT [PK__tblFacil__4273C4EB424A0693] PRIMARY KEY CLUSTERED ([UserId] ASC, [FacilityId] ASC)
);

