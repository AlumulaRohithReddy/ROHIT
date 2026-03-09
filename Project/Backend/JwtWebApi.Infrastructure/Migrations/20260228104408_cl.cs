using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace JwtWebApi.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class cl : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Claims_Users_ClaimsOfficerId",
                table: "Claims");

            migrationBuilder.DropForeignKey(
                name: "FK_Claims_Users_CustomerId",
                table: "Claims");

            migrationBuilder.DropIndex(
                name: "IX_Claims_ClaimsOfficerId",
                table: "Claims");

            migrationBuilder.DropIndex(
                name: "IX_Claims_CustomerId",
                table: "Claims");

            migrationBuilder.AddColumn<string>(
                name: "ClaimNumber",
                table: "Claims",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                table: "Claims",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "Claims",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<DateTime>(
                name: "IncidentDate",
                table: "Claims",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "IncidentLocation",
                table: "Claims",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ClaimNumber",
                table: "Claims");

            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "Claims");

            migrationBuilder.DropColumn(
                name: "Description",
                table: "Claims");

            migrationBuilder.DropColumn(
                name: "IncidentDate",
                table: "Claims");

            migrationBuilder.DropColumn(
                name: "IncidentLocation",
                table: "Claims");

            migrationBuilder.CreateIndex(
                name: "IX_Claims_ClaimsOfficerId",
                table: "Claims",
                column: "ClaimsOfficerId");

            migrationBuilder.CreateIndex(
                name: "IX_Claims_CustomerId",
                table: "Claims",
                column: "CustomerId");

            migrationBuilder.AddForeignKey(
                name: "FK_Claims_Users_ClaimsOfficerId",
                table: "Claims",
                column: "ClaimsOfficerId",
                principalTable: "Users",
                principalColumn: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Claims_Users_CustomerId",
                table: "Claims",
                column: "CustomerId",
                principalTable: "Users",
                principalColumn: "UserId",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
