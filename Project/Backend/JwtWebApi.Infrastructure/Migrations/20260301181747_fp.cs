using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace JwtWebApi.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class fp : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "SecurityAnswerHash",
                table: "Users",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "SecurityQuestion",
                table: "Users",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Claims_CustomerId",
                table: "Claims",
                column: "CustomerId");

            migrationBuilder.AddForeignKey(
                name: "FK_Claims_Users_CustomerId",
                table: "Claims",
                column: "CustomerId",
                principalTable: "Users",
                principalColumn: "UserId",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Claims_Users_CustomerId",
                table: "Claims");

            migrationBuilder.DropIndex(
                name: "IX_Claims_CustomerId",
                table: "Claims");

            migrationBuilder.DropColumn(
                name: "SecurityAnswerHash",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "SecurityQuestion",
                table: "Users");
        }
    }
}
