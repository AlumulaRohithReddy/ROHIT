using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace JwtWebApi.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class db : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Claims_Policies_PolicyId",
                table: "Claims");

            migrationBuilder.DropForeignKey(
                name: "FK_Claims_Users_CustomerId",
                table: "Claims");

            migrationBuilder.AddForeignKey(
                name: "FK_Claims_Policies_PolicyId",
                table: "Claims",
                column: "PolicyId",
                principalTable: "Policies",
                principalColumn: "PolicyId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Claims_Users_CustomerId",
                table: "Claims",
                column: "CustomerId",
                principalTable: "Users",
                principalColumn: "UserId",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Claims_Policies_PolicyId",
                table: "Claims");

            migrationBuilder.DropForeignKey(
                name: "FK_Claims_Users_CustomerId",
                table: "Claims");

            migrationBuilder.AddForeignKey(
                name: "FK_Claims_Policies_PolicyId",
                table: "Claims",
                column: "PolicyId",
                principalTable: "Policies",
                principalColumn: "PolicyId",
                onDelete: ReferentialAction.Cascade);

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
